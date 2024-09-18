import { Form } from "antd"
import { useEffect, useState } from "react";
import { getAliasInfosService } from "../service";
import { IAliasInfo } from "../api/core/interface";

const DashBoardPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [aliasInfos, setAliasInfos] = useState<IAliasInfo[]>([]);


  const dashboard = {
    
      content: (
      <div>
        <Form form={form} layout="vertical">
          <table className="w-full border-collapse border border-gray-300 table-fixed ml-10 mr-10 mt-5">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 w-1/2 md:w-1/9">Smart Email</th>
                <th className="border border-gray-300 p-2 w-1/2 md:w-1/9">Job Title</th>
                <th className="border border-gray-300 p-2 w-1/2 md:w-1/9">Landing Page</th>
                <th className="border border-gray-300 p-2 w-1/2 md:w-1/9">Plublished Date</th>
                <th className="border border-gray-300 p-2 w-1/2 md:w-1/9">End Date</th>
                <th className="border border-gray-300 p-2 w-1/2 md:w-1/9">No.Submited CV</th>
                <th className="border border-gray-300 p-2 w-1/2 md:w-1/9">No.Not-Decide CV</th>
                <th className="border border-gray-300 p-2 w-1/2 md:w-1/9">No.Accepted CV</th>
                <th className="border border-gray-300 p-2 w-1/2 md:w-1/9">No.Rejected CV</th>
              </tr>
            </thead>
            <tbody>
              {
                aliasInfos.map((info, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-4 w-1/2 md:w-1/9">
                    {info.alias}
                    </td>
                    <td className="border border-gray-300 p-4 w-1/2 md:w-1/9">
                    {info.job_title}
                    </td>
                    <td className="border border-gray-300 p-4 w-1/2 md:w-1/9">
                    {info.landing_page}
                    </td>
                    <td className="border border-gray-300 p-4 w-1/2 md:w-1/9">
                    {info.published_date}
                    </td>
                    <td className="border border-gray-300 p-4 w-1/2 md:w-1/9">
                    {info.end_date}
                    </td>
                    <td className="border border-gray-300 p-4 w-1/2 md:w-1/9">
                    {info.no_summitted_cv}
                    </td>
                    <td className="border border-gray-300 p-4 w-1/2 md:w-1/9">
                    {info.no_not_decide_cv}
                    </td>
                    <td className="border border-gray-300 p-4 w-1/2 md:w-1/9">
                    {info.no_accepted_cv}
                    </td>
                    <td className="border border-gray-300 p-4 w-1/2 md:w-1/9">
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

          for (const item of data){
            const jobTitle = item?.link?.answers_stage1[0].spilit('~')[1]

            const aliasInfo:IAliasInfo = {
              alias: item.alias.alias,
              job_title: jobTitle,
              landing_page: item.link.url,
              published_date: item.link.created_at,
              end_date: item.link.exp,
              no_summitted_cv: item.no_summited_cv,
              no_not_decide_cv: item.no_summited_cv - item.no_accepted_cv - item.no_rejected_cv,
              no_accepted_cv: item.no_accepted_cv,
              no_rejected_cv: item.no_rejected_cv
            }

            aliasInfos.push(aliasInfo)
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
    <strong>SMART EMAIL DASHBOARD</strong>
    </div>
    
    {
      dashboard.content
    }
  </div>);

}

export default DashBoardPage;
