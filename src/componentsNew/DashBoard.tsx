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
  let currentEmail = parseInt(localStorage.getItem('current_emails_count') ?? '0', 0);

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

          currentEmail = currentEmail - 1
          if (currentEmail < 0){
            currentEmail = 0
          }
          localStorage.setItem('current_emails_count', currentEmail.toString());

        }else{
          message.error(response.errors.message)
        }
      }catch(error){
        message.error(response.error)
      }finally{
        setLoadingPopup(false)
        hideModal()
      }
    }
  }

  const dashboard = {
    
      content: (
      <div className="px-8">
        <Form form={form} layout="vertical">
          <table className="w-full border-collapse border border-gray-300  mt-5">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2  ">Smart Email</th>
                <th className="border border-gray-300 p-2 ">Job Title</th>
                <th className="border border-gray-300 p-2  ">Landing Page</th>
                <th className="border border-gray-300 p-2  ">Published Date</th>
                <th className="border border-gray-300 p-2  ">End Date</th>
                <th className="border border-gray-300 p-2  ">Submited CV</th>
                <th className="border border-gray-300 p-2  ">Not-Decide CV</th>
                <th className="border border-gray-300 p-2 ">Accepted CV</th>
                <th className="border border-gray-300 p-2  ">Rejected CV</th>
                <th className="border border-gray-300 p-2  ">Manual CV</th>
                <th className=" p-2 w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {
                aliasInfos.map((info, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-4 text-center align-middle ">
                    {info.alias}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle ">
                    {info.job_title}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle">
                      <div>
                      <a href={info.landing_page} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                         {info.landing_page}
                      </a>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle">
                    {info.published_date}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle">
                    {info.end_date}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle">
                    {info.no_summitted_cv}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle">
                    {info.no_not_decide_cv}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle">
                    {info.no_accepted_cv}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle">
                    {info.no_rejected_cv}
                    </td>
                    <td className="border border-gray-300 p-4 text-center align-middle">
                    {info.no_manual_cv}
                    </td>
                    <td className=" text-center align-middle w-[50px]">
                    {
                      info.alias_id > 0 && (<Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(index)}
                        />)
                    }
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
              no_rejected_cv: alias.no_rejected_cv,
              no_manual_cv: alias.no_manual_cv
            }
            if (aliasInfo && alias.aliasId){
              aliasInfos.push(aliasInfo)
            }else{
              aliasInfos.push({
                alias_id: 0,
                alias: 'N/A',
                job_title: 'N/A',
                landing_page: 'N/A',
                published_date: 'N/A',
                end_date: 'N/A',
                no_summitted_cv: '0',
                no_not_decide_cv: '0',
                no_accepted_cv: '0',
                no_rejected_cv: '0',
                no_manual_cv: '0'
              })
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
