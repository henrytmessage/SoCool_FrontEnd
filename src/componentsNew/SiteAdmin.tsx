import { Form } from "antd";
import { useEffect, useState } from "react";

const SiteAdminPage = () => {
  const [form] = Form.useForm();
  const [admin, setAdmin] = useState(false)
  
  const siteAdmin = {
    
      content: (
      <div>
        <Form form={form} layout="vertical">
          <table className="w-full border-collapse border border-gray-300 ml-10 mr-10 mt-5">
            <thead>
              <tr>
                <th className=" p-2 w-[50px]"></th>
                <th className="border border-gray-300 p-2  ">Email</th>
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
                
              }
            </tbody>
          </table>

        </Form>
      </div>)
    
  }

  useEffect(() => {

  }
  ,[])

  return (<div>
    <div className="ml-10 mt-10">
    <strong>Admin</strong>
    </div>
    
    {
      admin ? siteAdmin.content : <div/>
    }

  </div>);

}

export default SiteAdminPage;