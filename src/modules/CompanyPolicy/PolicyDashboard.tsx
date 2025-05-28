import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronRight, FileText, BookOpen, ClipboardList } from 'lucide-react';

const CompanyPolicyDashboard = () => {
  const [activeTab, setActiveTab] = useState('work-rules');

  // Work Rules Data
  const workRules = [
    "Employees shall maintain a professional appearance at all times while on duty and shall wear clothing appropriate to their duties.",
    "Employees shall be at the work place, ready to work, at the regular starting time. Working hours for all employees are Monday to Saturday, 8:00 am. – 4:00 pm and on all Sunday and holidays, office will remain closed. Lunch break will be between 12:15 pm – 12.40 pm. All employees are expected to be punctual and reach office on time. After 8:05 am it would be marked as late.",
    "Employees must comply with time limitations on rest and meal periods.",
    "Employees shall not use Company equipment, materials or facilities for personal purposes. Use of email, phones and the internet is for work purposes only.",
    "Employees shall not engage in outside employment that is detrimental to the Company's interest.",
    "Employees shall not reveal information in Company records to unauthorized persons.",
    "Employees shall be responsible for securing prescription and/or nonprescription drugs in their possession while at the work site. An employee taking prescribed medication(s) under the orders of a physician shall report the fact to her/his supervisor if the medication(s) may affect her/his performance.",
    "Possession, ingestion or distribution of alcoholic beverages and/or illegal or controlled substances at work sites is prohibited.",
    "Racial, ethnic, or sexual harassment of any person is prohibited.",
    "Firearms or weapons of any kind are prohibited on work sites.",
    "Employees shall maintain current and accurate personal data with their supervisor and the Human Resource Office.",
    "Employees shall not conduct any personal business during working hours nor use state or work site telephones or cell phones to place or receive personal calls except in emergencies or with supervisory approval.",
    "Unauthorized possession, duplication, or use of agency keys, badges, identification cards or any other property is prohibited.",
    "The removal or destruction of property, documents, and/or other equipment or material, including client property or records, from work sites without authorization is prohibited.",
    "Employees unable to report for work shall call in to their supervisor or designee within one-half hour of the start of their scheduled workday to provide the reason for their tardiness or absence and/or to request the use of earned time, as required.",
    "Employees shall be at their assigned work places at the designated hour ready to work, and remain at work at all times in a fit physical and mental condition until the end of their shift unless excused by their immediate supervisor.",
    "Employees are required to work overtime as directed.",
    "Employees shall not refuse or fail to perform work assigned to them.",
    "An employee shall not interfere with the productivity of other employees nor cause any interruption of work.",
    "Sleeping or inattentiveness on duty is prohibited.",
    "Personal errands, favors or exchanging of personal items, including money, between clients and employees is prohibited.",
    "Unauthorized tape recordings, videos, or photographing of clients or employees is prohibited.",
    "The development of sexual or otherwise exploitive relationships between employees and clients is prohibited.",
    "Physical violence, verbal abuse, inappropriate or indecent conduct and behavior that endangers the safety and welfare of persons or property is prohibited.",
    "Employees shall not falsify any client records, work reports, employee records, or other official documents.",
    "Employees shall immediately report alleged violations of existing work rules, policies, procedures or regulations to a supervisor."
  ];

  // Company Policy Data
  const companyPolicies = [
    {
      title: "Hours of Operation/Work Schedules",
      content: "Certain employees may be assigned to different work schedules and/or shifts outside of normal office hours. If an employee must be outside of the office for non-business related reasons during their normal work schedule, they should inform their manager."
    },
    {
      title: "Telecommuting",
      content: "The Company is committed to creating a work environment where the needs of our customers, employees, and the Company are balanced. Therefore, the Company tries to be flexible in its approach to work styles and location. Telecommuting arrangements may be made on an \"as needed basis\" or set up on a regular schedule. In either case, employees are encouraged to spend time working in the office whenever possible. This allows employees to be accessible to customers and creates a sense of consistency and collaboration among work teams. When employees desire to work at home, the Company asks that they do so in a manner which is in keeping with a workstyle of accessibility, communication, and productivity. All telecommuting arrangements are subject to approval by the employee's manager."
    },
    {
      title: "Attendance Policy",
      content: "Regular attendance is essential to the Company's efficient operation and is a necessary condition of employment. When employees are absent, schedules and customer commitments fall behind, and other employees must assume added workloads. Employees are expected to report to work as scheduled and on time. If it is impossible to report for work as scheduled, employees must call their manager before their starting time. If your manager is unavailable, a voice message should be left. If the absence is to continue beyond the first day, the employee must notify their manager on a daily basis unless otherwise arranged. Calling in is the responsibility of every employee who is absent. Absence for three consecutive work days without notifying the manager is considered a voluntary termination."
    },
    {
      title: "Leave of Absence",
      content: "Employees are eligible to apply for an unpaid leave of absence if they have been a regular employee of the Company for at least one year and scheduled to work 20 hours or more a week. The employee's manager will make a decision on the leave request. The request for leave will be reviewed based on the reason for the request, previous attendance record, previous leave requests and the impact the absence will have on the Company. Authorized leaves for illness or disability begin after employees have exhausted accrued sick leave, vacation and personal holiday time. A personal leave of absence, if granted, begins after vacation and personal holiday time have been used. Human Resources can provide employees with which benefits, in addition to retained seniority, can be continued during the leave. If an employee wishes to continue benefits, it must arranged for directly with Human Resources. If the request for leave of absence for personal reasons, the employee's manager, with the advice of Human Resources, will decide whether the current position will be held open, or if a position will be made available upon the employees return from leave."
    },
    {
      title: "Pay and Compensation",
      content: "Employees are paid on the 1st and 15th of each month. Employees must present their Social Security card to Employment when completing the required forms. Optional forms employees may wish to file are paycheck direct deposit authorization card, union or association dues card, and other deductible employee paid benefits."
    },
    {
      title: "Overtime",
      content: "Non-exempt employees are eligible to receive overtime pay if they work more than 40 hours in a given week. Holiday, vacation, and sick time are not included in hours used to determine overtime eligibility. Overtime pay equals 1.5 times and employee's regular hourly rate. All overtime must be approved the manager in advance."
    },
    {
      title: "Vacation",
      content: "All full-time employees are eligible for vacation pay. New full-time employees will receive a pro-rata number of vacation days based on one day for each month worked in the hired calendar year, not to exceed 10 days."
    },
    {
      title: "Sick Days",
      content: "Sick days are provided for illness of the employee, their spouse or children. Employees should use their personal days or vacation days non-illness related time off. All full-time employees will receive sick days according to the following schedule: Employees will be eligible for paid sick days after 6 months of employment. After 6 months of employment, employees will be eligible for one sick day for every two months worked from date of hire, with a maximum of 5 days in their first year of employment. Every succeeding calendar year, employees will be eligible for 5 sick days. Sick days may be accumulated and carried over from year to year to a maximum of 10 days. All other unused sick days by the end of the year is forfeited."
    },
    {
      title: "Health Benefits",
      content: "Full-time employees, their spouses and eligible dependent children are eligible for health benefits on the first day of the month following 30 days of continuous employment. For health benefits, full-time employees are defined as regular employees (excludes interns and contract employees) who work exceeds 30 hours per week. Employees should consult the separate materials prepared directly by the Company's health care insurance company for details of the plan."
    },
    {
      title: "Equal Employment Policy",
      content: "It is the policy of the Company to provide equal opportunity for all qualified persons and not discriminate against any employee or applicant for employment because of race, color, religion, sex, age, national origin, veteran status, disability, or any other protected status. This policy applies to recruitment and placement, promotion, training, transfer, retention, rate of pay and all other details and conditions of employment. Employment and promotion decisions will be based on merit and the principle of furthering equal opportunity. The requirements we impose in filling a position will be those that validly relate to the job performance required. All other personnel actions including compensation, benefits, transfers, layoffs, recalls from lay-offs, training, education, tuition assistance and recreation programs will be administered without regard to race, color, religion, sex, age, national origin, disability, veteran status, or any other protected status, in accordance with appropriate law."
    },
    {
      title: "Termination",
      content: "Employees who voluntarily resign from the Company are asked to provide at least two week advance notice of their resignation. This notice should be in writing and should briefly state the reason for leaving and the anticipated last day of work."
    },
    {
      title: "Drug and Alcohol Policy",
      content: "The Company realizes that the misuse of drugs and alcohol impairs employee health and productivity. Drug and alcohol problems result in unsafe working conditions for all employees and customers. The Company is committed to maintaining a productive, safe, and healthy work environment, free of unauthorized drug and alcohol use. Any employee involved in the unlawful use, sale, manufacturing, dispensing or possession of controlled substances, illicit drugs and alcohol on Company premises or work sites, or working under the influence of such substances, will be subject to disciplinary action up to and including dismissal and referral for prosecution. In addition, the Company has developed and maintains a comprehensive Drug and Alcohol Policy, which employees may obtain from Human Resources."
    },
    {
      title: "Safety Policy",
      content: "The Company is sincerely interested in the safety and well-being of our employees. The Company will make every effort to keep the office equipment in excellent condition and make sure that all safety devices are working properly. If, in spite of our efforts to ensure safe working conditions, an employee has an accident or becomes ill on the job, it should be reported to the manager immediately. They will see that prompt medical attention is provided."
    },
    {
      title: "Workplace Security Policy",
      content: "The Company is committed to maintain a safe and secure workplace. In order to maintain a secure work environment, the company strictly prohibits employees and visitors from bringing any firearm on Company property. In addition, all visitors are asked to check in with the receptionist. Failure to comply with this policy will result in disciplinary action up to and including termination."
    },
    {
      title: "Dress Code Policy",
      content: "The Company maintains a business casual working environment. All employees should use discretion in wearing attire that is appropriate for the office and customer interaction."
    },
    {
      title: "Smoking Policy",
      content: "The Company maintains a non-smoking policy within the office. Employees should smoke only in those areas of the building which are smoking designated."
    },
    {
      title: "Telephone and Computer Use Policy",
      content: "The Company understands that when employees work during the week it is occasionally necessary to conduct personal business during office hours. However, employees should limit their personal use of the telephone and computer during office hours. Talk to your manager if you have any questions as to how much is too much time. Because telephone and e-mail systems are provided by the Company at its expense for business use, all messages sent by or received on those systems are company documents. The Company reserves the right to access and to disclose the messages that you send or receive on the voice mail or e-mail systems. Employees should also be aware that \"deleted\" messages from the computer screen may not actually be deleted from the e-mail system. Employees who abuse this policy are subject to disciplinary procedures up to and including discharge."
    },
    {
      title: "Business Expense Reimbursement",
      content: "The company will reimburse employees for expense which are directly business related to include: travel expenses, office supplies, and mileage incurred while traveling on business. Employees must submit receipts for all expenses. Employees should consult with their manager prior to business trips to confirm eligible expenses."
    },
    {
      title: "Personal Days",
      content: "Employees are eligible for 4 paid personal days per calendar year. New employees will accrue 1 personal day for every 3 months worked in the hired calendar year. Personal days may be used at the employee's discretion for religious holidays and personal matters. Personal days not used by the end of the year will be paid out to the employee in the final paycheck for that year."
    }
  ];
  
  return (
    <div className="bg-white text-black">
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-black text-white py-6">
          <CardTitle className="text-2xl font-bold flex items-center justify-center">
            <FileText className="mr-2" size={24} />
            Company Rules & Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="work-rules" className="w-full" onValueChange={setActiveTab}>
            <div className="bg-black border-b border-gold">
              <TabsList className="bg-black w-full grid grid-cols-2">
                <TabsTrigger 
                  value="work-rules"
                  className={`py-3 text-white hover:text-amber-300 ${activeTab === 'work-rules' ? 'border-b-2 border-amber-300 text-amber-300' : ''}`}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Work Rules
                </TabsTrigger>
                <TabsTrigger 
                  value="company-policies"
                  className={`py-3 text-white hover:text-amber-300 ${activeTab === 'company-policies' ? 'border-b-2 border-amber-300 text-amber-300' : ''}`}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Company Policies
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="work-rules" className="mt-0 p-4">
              <div className="space-y-4">
                {workRules.map((rule, index) => (
                  <div key={index} className="flex border-b border-gray-200 py-3">
                    <div className="text-amber-500 mr-2 flex-shrink-0">
                      <ChevronRight size={20} />
                    </div>
                    <div>{rule}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="company-policies" className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                {companyPolicies.map((policy, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="px-4 py-3 text-black hover:text-amber-700 hover:no-underline font-medium">
                      <div className="flex items-center">
                        <span className="text-amber-600 mr-2">{index + 1}.</span>
                        {policy.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-3 border-l-2 border-amber-200 ml-4 bg-gray-50">
                      {policy.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyPolicyDashboard;