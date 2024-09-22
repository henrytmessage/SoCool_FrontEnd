import { Button, Form, message, Typography } from "antd"
import { useEffect, useState } from "react";
import { getAliasInfosService, removeAliasService } from "../service";
import { IAliasInfo, IRemoveAlias } from "../api/core/interface";
import { formatDate, toCustomDate } from "../function";
import { DeleteOutlined } from '@ant-design/icons';
import PopupModal from "./PopupModal";

const { Title, Text } = Typography;
const DashBoardPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true)
  const [loadingPopup, setLoadingPopup] = useState(false)
  const [aliasInfos, setAliasInfos] = useState<IAliasInfo[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [aliasInfo, setALiasInfo] = useState<IAliasInfo>()

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handleRemove = (index:number) => {
    setIsModalVisible(true)
    setALiasInfo(aliasInfos[index])
  }

  const removeAlias = async () => {
    setLoadingPopup(true)
    if (aliasInfo){
      const body: IRemoveAlias = {
        alias_id : aliasInfo.alias_id
      }
      const response = await removeAliasService(body)
      try{
        if (response.status_code == 200 ){
          message.success('Remove successfully!')
          const filteredAliasInfos = aliasInfos.filter( alias => alias.alias_id != aliasInfo.alias_id)
          setAliasInfos(filteredAliasInfos)
        }else{
          message.error(response.errors.message)
        }
      }catch(error){
        message.error(response.error)
      }finally{
        setLoadingPopup(true)
        hideModal()
      }
    }
  }

  const dashboard = {
    
      content: (
      <div>
        <Form form={form} layout="vertical">
          <table className="w-full border-collapse border border-gray-300 ml-10 mr-10 mt-5">
            <thead>
              <tr>
                <th className=" p-2 w-[50px]"></th>
                <th className="border border-gray-300 p-2  ">Smart Email</th>
                <th className="border border-gray-300 p-2 ">Job Title</th>
                <th className="border border-gray-300 p-2  ">Landing Page</th>
                <th className="border border-gray-300 p-2  ">Plublished Date</th>
                <th className="border border-gray-300 p-2  ">End Date</th>
                <th className="border border-gray-300 p-2  ">No.Submited CV</th>
                <th className="border border-gray-300 p-2  ">No.Not-Decide CV</th>
                <th className="border border-gray-300 p-2 ">No.Accepted CV</th>
                <th className="border border-gray-300 p-2  ">No.Rejected CV</th>
              </tr>
            </thead>
            <tbody>
              {
                aliasInfos.map((info, index) => (
                  <tr key={index}>
                    <td className=" text-center align-middle w-[50px]">
                    <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(index)}
                    />
                    </td>
                    
                    <td className="border border-gray-300 p-4  text-center align-middle">
                    {info.alias}
                    </td>
                    <td className="border border-gray-300 p-4 ">
                    {info.job_title}
                    </td>
                    <td className="border border-gray-300 p-4  text-center align-middle">
                    {info.landing_page}
                    </td>
                    <td className="border border-gray-300 p-4 ">
                    {info.published_date}
                    </td>
                    <td className="border border-gray-300 p-4 ">
                    {info.end_date}
                    </td>
                    <td className="border border-gray-300 p-4 ">
                    {info.no_summitted_cv}
                    </td>
                    <td className="border border-gray-300 p-4 ">
                    {info.no_not_decide_cv}
                    </td>
                    <td className="border border-gray-300 p-4 ">
                    {info.no_accepted_cv}
                    </td>
                    <td className="border border-gray-300 p-4 ">
                    {info.no_rejected_cv}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

        </Form>
      </div>)
    
  }

  useEffect(() => {
    const getDashBoard = async () => {
      try{
        setLoading(true)
        const response  = await getAliasInfosService()
        if (response?.status_code == 200){
          const data = response?.data          

          const aliasInfos:IAliasInfo[] = []

          for (const alias of data){
            
            const jobTitle = alias?.answers_stage1?.[0].split('~')[1]

            const aliasInfo:IAliasInfo = {
              alias_id: alias.aliasId,
              alias: alias.aliasName,
              job_title: jobTitle,
              landing_page: alias.url,
              published_date: formatDate(alias.created_at),
              end_date: formatDate(alias.exp),
              no_summitted_cv: alias.no_summited_cv,
              no_not_decide_cv: (Number(alias.no_summited_cv) - Number(alias.no_accepted_cv) - Number(alias.no_rejected_cv)).toString(),
              no_accepted_cv: alias.no_accepted_cv,
              no_rejected_cv: alias.no_rejected_cv
            }
            if (aliasInfo && alias.alias_id){
              aliasInfos.push(aliasInfo)
            }
            
          }
          setAliasInfos(aliasInfos)

        }
      }catch(error){
        console.error(error);
      }finally{
        setLoading(false)
      } 
    };
    getDashBoard();
    }
  ,[])

  return (<div>
    <div className="ml-10 mt-10">
    <Title level={2}>Smart Email Dashboard</Title>
    </div>
    
    {
      !loading ? dashboard.content : <div/>
    }
    <PopupModal isVisible = {isModalVisible} hideModal={hideModal} confirm = { removeAlias } loading = {loadingPopup} title="Are you sure to delete this smart email?"/>

  </div>);

}

export default DashBoardPage;
