import{r as B,j as e,p as N}from"./iframe-M9O-K8SB.js";import{a as I}from"./Button-Dkbd3KcU.js";import{f as Y,j as z,y as O,R as L,s as U,T as P}from"./index-BKJKY9Wv.js";import{d as V,u as E}from"./defineComponent-BmABoWOu.js";import{F as t}from"./Flex-Bz2InqMs.js";import{B as w}from"./Button-BbTpZl37.js";import{B as $}from"./Box-FY2l0ff9.js";import{T as l}from"./Text-RD33cT1s.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BXllfVt4.js";import"./useObjectRef-BPFp5snO.js";import"./clsx-B-dksMZM.js";import"./Label-o9S_v-xF.js";import"./Hidden-DTd05gNK.js";import"./useFocusable-BwFERnd_.js";import"./useLabel-COjMvP6r.js";import"./useLabels-C3g0X61E.js";import"./context-Bv6kxITJ.js";import"./useButton-F9hepFpV.js";import"./usePress-ByOsZuB9.js";import"./useFocusRing-COnCKKka.js";import"./useStyles-BRwt6BXn.js";import"./useSurface-CJaN3YoD.js";const G={"bui-Alert":"_bui-Alert_1sp1i_20","bui-AlertIcon":"_bui-AlertIcon_1sp1i_57","bui-AlertContentWrapper":"_bui-AlertContentWrapper_1sp1i_74","bui-AlertContent":"_bui-AlertContent_1sp1i_74","bui-AlertTitle":"_bui-AlertTitle_1sp1i_94","bui-AlertDescription":"_bui-AlertDescription_1sp1i_99","bui-AlertSpinner":"_bui-AlertSpinner_1sp1i_104","bui-spin":"_bui-spin_1sp1i_1","bui-AlertActions":"_bui-AlertActions_1sp1i_114"},H=V()({styles:G,classNames:{root:"bui-Alert",contentWrapper:"bui-AlertContentWrapper",content:"bui-AlertContent",title:"bui-AlertTitle",description:"bui-AlertDescription",icon:"bui-AlertIcon",spinner:"bui-AlertSpinner",actions:"bui-AlertActions"},surface:"container",propDefs:{status:{dataAttribute:!0,default:"info"},loading:{dataAttribute:!0},icon:{},customActions:{},title:{},description:{},surface:{},className:{},style:{}},utilityProps:["m","mb","ml","mr","mt","mx","my"]}),n=B.forwardRef((A,R)=>{const{ownProps:S,restProps:k,dataAttributes:D,utilityStyle:q}=E(H,A),{classes:i,status:W,icon:y,loading:C,customActions:j,title:F,description:T,style:_}=S,b=(()=>{if(y===!1)return null;if(B.isValidElement(y))return y;if(y===!0)switch(W){case"success":return e.jsx(U,{"aria-hidden":"true"});case"warning":return e.jsx(L,{"aria-hidden":"true"});case"danger":return e.jsx(O,{"aria-hidden":"true"});default:return e.jsx(z,{"aria-hidden":"true"})}return null})();return e.jsxs("div",{className:i.root,ref:R,style:{..._,...q},...D,...k,"data-has-description":T?"true":"false",children:[e.jsxs("div",{className:i.contentWrapper,children:[C?e.jsx("div",{className:i.icon,children:e.jsx(I,{"aria-label":"Loading",isIndeterminate:!0,className:i.spinner,children:e.jsx(Y,{"aria-hidden":"true"})})}):b&&e.jsx("div",{className:i.icon,children:b}),e.jsxs("div",{className:i.content,children:[F&&e.jsx("div",{className:i.title,children:F}),T&&e.jsx("div",{className:i.description,children:T})]})]}),j&&e.jsx("div",{className:i.actions,children:j})]})});n.displayName="Alert";n.__docgenInfo={description:`A component for displaying alert messages with different status levels.

@remarks
The Alert component supports multiple status variants (info, success, warning, danger)
and can display icons, loading states, and custom actions. It automatically handles
icon selection based on status when the icon prop is set to true.

@example
Basic usage with title only:
\`\`\`tsx
<Alert status="info" title="This is an informational message" />
\`\`\`

@example
With title and description:
\`\`\`tsx
<Alert
  status="warning"
  icon={true}
  title="Pending Review"
  description="Please review the following items before proceeding."
/>
\`\`\`

@example
With custom actions and loading state:
\`\`\`tsx
<Alert
  status="success"
  icon={true}
  title="Operation completed"
  description="Your changes have been saved successfully."
  loading={isProcessing}
  customActions={
    <>
      <Button size="small" variant="tertiary">Dismiss</Button>
      <Button size="small" variant="primary">View</Button>
    </>
  }
/>
\`\`\`

@public`,methods:[],displayName:"Alert",props:{m:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},mb:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},ml:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},mr:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},mt:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},mx:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},my:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:`| '0.5'
| '1'
| '1.5'
| '2'
| '3'
| '4'
| '5'
| '6'
| '7'
| '8'
| '9'
| '10'
| '11'
| '12'
| '13'
| '14'
| string`,elements:[{name:"literal",value:"'0.5'"},{name:"literal",value:"'1'"},{name:"literal",value:"'1.5'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'4'"},{name:"literal",value:"'5'"},{name:"literal",value:"'6'"},{name:"literal",value:"'7'"},{name:"literal",value:"'8'"},{name:"literal",value:"'9'"},{name:"literal",value:"'10'"},{name:"literal",value:"'11'"},{name:"literal",value:"'12'"},{name:"literal",value:"'13'"},{name:"literal",value:"'14'"},{name:"string"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},surface:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:`| '0'
| '1'
| '2'
| '3'
| 'danger'
| 'warning'
| 'success'
| 'auto'`,elements:[{name:"literal",value:"'0'"},{name:"literal",value:"'1'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"},{name:"literal",value:"'auto'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:`| '0'
| '1'
| '2'
| '3'
| 'danger'
| 'warning'
| 'success'
| 'auto'`,elements:[{name:"literal",value:"'0'"},{name:"literal",value:"'1'"},{name:"literal",value:"'2'"},{name:"literal",value:"'3'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"},{name:"literal",value:"'auto'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},status:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'info' | 'success' | 'warning' | 'danger'",elements:[{name:"literal",value:"'info'"},{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'danger'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'info' | 'success' | 'warning' | 'danger'",elements:[{name:"literal",value:"'info'"},{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'danger'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},icon:{required:!1,tsType:{name:"union",raw:"boolean | ReactElement",elements:[{name:"boolean"},{name:"ReactElement"}]},description:""},loading:{required:!1,tsType:{name:"boolean"},description:""},customActions:{required:!1,tsType:{name:"ReactNode"},description:""},title:{required:!1,tsType:{name:"ReactNode"},description:""},description:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"CSSProperties"},description:""}}};const a=N.meta({title:"Backstage UI/Alert",component:n,argTypes:{status:{control:"select",options:["info","success","warning","danger"]},icon:{control:"boolean"},loading:{control:"boolean"}}}),s=a.story({args:{title:"This is an alert message",icon:!0}}),o=a.story({args:{title:"This is an alert message"},parameters:{argTypes:{status:{control:!1}}},render:()=>e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(n,{status:"info",icon:!0,title:"This is an informational alert with helpful information."}),e.jsx(n,{status:"success",icon:!0,title:"Your changes have been saved successfully."}),e.jsx(n,{status:"warning",icon:!0,title:"This action may have unintended consequences."}),e.jsx(n,{status:"danger",icon:!0,title:"An error occurred while processing your request."})]})}),u=a.story({render:()=>e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(n,{status:"info",icon:!0,title:"New Feature Available",description:"We've added support for custom table columns. Check the documentation to learn more."}),e.jsx(n,{status:"success",icon:!0,title:"Deployment Successful",description:"Your application has been deployed to production. All health checks passed."}),e.jsx(n,{status:"warning",icon:!0,title:"Pending Review",description:"Please review the following items before proceeding with the deployment."}),e.jsx(n,{status:"danger",icon:!0,title:"Authentication Failed",description:"Unable to verify your credentials. Please check your username and password and try again."})]})}),c=a.story({render:()=>e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(n,{status:"info",icon:!1,title:"This is an informational alert without an icon."}),e.jsx(n,{status:"success",icon:!1,title:"Your changes have been saved successfully."}),e.jsx(n,{status:"warning",icon:!1,title:"This action may have unintended consequences."}),e.jsx(n,{status:"danger",icon:!1,title:"An error occurred while processing your request."})]})}),m=a.story({render:()=>e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(n,{status:"info",icon:e.jsx(P,{"aria-hidden":"true"}),title:"This alert uses a custom cloud icon instead of the default info icon."}),e.jsx(n,{status:"success",icon:e.jsx(P,{"aria-hidden":"true"}),title:"Custom icons work with any status variant."})]})}),r=a.story({render:A=>e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(n,{status:"info",icon:!0,title:"This alert has a dismiss action on the right.",customActions:e.jsx(w,{size:"small",variant:"tertiary",children:"Dismiss"}),...A}),e.jsx(n,{status:"success",icon:!0,title:"Your changes have been saved. Would you like to continue?",customActions:e.jsxs(e.Fragment,{children:[e.jsx(w,{size:"small",variant:"tertiary",children:"Cancel"}),e.jsx(w,{size:"small",variant:"primary",children:"Continue"})]}),...A}),e.jsx(n,{status:"danger",icon:!0,title:"An error occurred while processing your request. Please try again.",customActions:e.jsx(w,{size:"small",variant:"primary",children:"Retry"}),...A})]})}),d=r.extend({args:{description:"This is a description of the alert."}}),p=a.story({render:()=>e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Info"}),e.jsx(n,{status:"info",icon:!0,loading:!0,title:"Processing your request..."}),e.jsx(l,{children:"Success"}),e.jsx(n,{status:"success",icon:!0,loading:!0,title:"Saving changes..."}),e.jsx(l,{children:"Warning"}),e.jsx(n,{status:"warning",icon:!0,loading:!0,title:"Checking for issues..."}),e.jsx(l,{children:"Danger"}),e.jsx(n,{status:"danger",icon:!0,loading:!0,title:"Attempting recovery..."})]})}),v=a.story({render:()=>e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(n,{status:"info",icon:!0,loading:!0,title:"Processing your request",description:"This may take a few moments. Please do not close this window."}),e.jsx(n,{status:"success",icon:!0,loading:!0,title:"Deployment in Progress",description:"Your application is being deployed to production. You'll receive a notification when complete."})]})}),g=a.story({render:()=>e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(n,{status:"info",icon:!0,title:"This is a longer alert message that demonstrates how the component handles multiple lines of text. The content will wrap naturally and maintain proper spacing with the icon and any actions. This is useful for providing detailed information to users when necessary."}),e.jsx(n,{status:"warning",icon:!0,title:"This alert combines long content with actions. The actions remain aligned to the right even when the content wraps to multiple lines. This ensures a consistent and predictable layout regardless of content length.",customActions:e.jsx(w,{size:"small",variant:"tertiary",children:"Dismiss"})})]})}),h=a.story({render:()=>e.jsxs(t,{direction:"column",gap:"4",children:[e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Default Surface"}),e.jsxs(t,{direction:"column",gap:"2",p:"4",children:[e.jsx(n,{status:"info",icon:!0,title:"Alert on default surface"}),e.jsx(n,{status:"success",icon:!0,title:"Alert on default surface"})]})]}),e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(l,{children:"On Surface 0"}),e.jsxs(t,{direction:"column",gap:"2",surface:"0",p:"4",children:[e.jsx(n,{status:"info",icon:!0,title:"Alert on surface 0"}),e.jsx(n,{status:"success",icon:!0,title:"Alert on surface 0"})]})]}),e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(l,{children:"On Surface 1"}),e.jsxs(t,{direction:"column",gap:"2",surface:"1",p:"4",children:[e.jsx(n,{status:"info",icon:!0,title:"Alert on surface 1"}),e.jsx(n,{status:"success",icon:!0,title:"Alert on surface 1"})]})]}),e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(l,{children:"On Surface 2"}),e.jsxs(t,{direction:"column",gap:"2",surface:"2",p:"4",children:[e.jsx(n,{status:"info",icon:!0,title:"Alert on surface 2"}),e.jsx(n,{status:"success",icon:!0,title:"Alert on surface 2"})]})]}),e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(l,{children:"On Surface 3"}),e.jsxs(t,{direction:"column",gap:"2",surface:"3",p:"4",children:[e.jsx(n,{status:"info",icon:!0,title:"Alert on surface 3"}),e.jsx(n,{status:"success",icon:!0,title:"Alert on surface 3"})]})]})]})}),f=a.story({args:{title:"This alert changes status responsively",icon:!0,status:{initial:"info",sm:"success",md:"warning",lg:"danger"}}}),x=a.story({render:()=>e.jsxs($,{surface:"1",py:"4",children:[e.jsx(n,{status:"success",icon:!0,title:"Alert with custom margin",mb:"4",mx:"4"}),e.jsx(n,{status:"success",icon:!0,title:"Alert with custom margin",mx:"4"})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => <Alert title="This is an alert message" icon />;
`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const StatusVariants = () => (
  <Flex direction="column" gap="4">
    <Alert
      status="info"
      icon={true}
      title="This is an informational alert with helpful information."
    />
    <Alert
      status="success"
      icon={true}
      title="Your changes have been saved successfully."
    />
    <Alert
      status="warning"
      icon={true}
      title="This action may have unintended consequences."
    />
    <Alert
      status="danger"
      icon={true}
      title="An error occurred while processing your request."
    />
  </Flex>
);
`,...o.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const WithDescription = () => (
  <Flex direction="column" gap="4">
    <Alert
      status="info"
      icon={true}
      title="New Feature Available"
      description="We've added support for custom table columns. Check the documentation to learn more."
    />
    <Alert
      status="success"
      icon={true}
      title="Deployment Successful"
      description="Your application has been deployed to production. All health checks passed."
    />
    <Alert
      status="warning"
      icon={true}
      title="Pending Review"
      description="Please review the following items before proceeding with the deployment."
    />
    <Alert
      status="danger"
      icon={true}
      title="Authentication Failed"
      description="Unable to verify your credentials. Please check your username and password and try again."
    />
  </Flex>
);
`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const WithoutIcons = () => (
  <Flex direction="column" gap="4">
    <Alert
      status="info"
      icon={false}
      title="This is an informational alert without an icon."
    />
    <Alert
      status="success"
      icon={false}
      title="Your changes have been saved successfully."
    />
    <Alert
      status="warning"
      icon={false}
      title="This action may have unintended consequences."
    />
    <Alert
      status="danger"
      icon={false}
      title="An error occurred while processing your request."
    />
  </Flex>
);
`,...c.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const CustomIcon = () => (
  <Flex direction="column" gap="4">
    <Alert
      status="info"
      icon={<RiCloudLine aria-hidden="true" />}
      title="This alert uses a custom cloud icon instead of the default info icon."
    />
    <Alert
      status="success"
      icon={<RiCloudLine aria-hidden="true" />}
      title="Custom icons work with any status variant."
    />
  </Flex>
);
`,...m.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const WithActions = () => (
  <Flex direction="column" gap="4">
    <Alert
      status="info"
      icon={true}
      title="This alert has a dismiss action on the right."
      customActions={
        <Button size="small" variant="tertiary">
          Dismiss
        </Button>
      }
    />
    <Alert
      status="success"
      icon={true}
      title="Your changes have been saved. Would you like to continue?"
      customActions={
        <>
          <Button size="small" variant="tertiary">
            Cancel
          </Button>
          <Button size="small" variant="primary">
            Continue
          </Button>
        </>
      }
    />
    <Alert
      status="danger"
      icon={true}
      title="An error occurred while processing your request. Please try again."
      customActions={
        <Button size="small" variant="primary">
          Retry
        </Button>
      }
    />
  </Flex>
);
`,...r.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const WithActionsAndDescriptions = () => (
  <Alert description="This is a description of the alert." />
);
`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const LoadingVariants = () => (
  <Flex direction="column" gap="4">
    <Text>Info</Text>
    <Alert
      status="info"
      icon={true}
      loading
      title="Processing your request..."
    />

    <Text>Success</Text>
    <Alert status="success" icon={true} loading title="Saving changes..." />

    <Text>Warning</Text>
    <Alert
      status="warning"
      icon={true}
      loading
      title="Checking for issues..."
    />

    <Text>Danger</Text>
    <Alert status="danger" icon={true} loading title="Attempting recovery..." />
  </Flex>
);
`,...p.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{code:`const LoadingWithDescription = () => (
  <Flex direction="column" gap="4">
    <Alert
      status="info"
      icon={true}
      loading
      title="Processing your request"
      description="This may take a few moments. Please do not close this window."
    />
    <Alert
      status="success"
      icon={true}
      loading
      title="Deployment in Progress"
      description="Your application is being deployed to production. You'll receive a notification when complete."
    />
  </Flex>
);
`,...v.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const LongContent = () => (
  <Flex direction="column" gap="4">
    <Alert
      status="info"
      icon={true}
      title="This is a longer alert message that demonstrates how the component handles multiple lines of text. The content will wrap naturally and maintain proper spacing with the icon and any actions. This is useful for providing detailed information to users when necessary."
    />
    <Alert
      status="warning"
      icon={true}
      title="This alert combines long content with actions. The actions remain aligned to the right even when the content wraps to multiple lines. This ensures a consistent and predictable layout regardless of content length."
      customActions={
        <Button size="small" variant="tertiary">
          Dismiss
        </Button>
      }
    />
  </Flex>
);
`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const OnDifferentSurfaces = () => (
  <Flex direction="column" gap="4">
    <Flex direction="column" gap="4">
      <Text>Default Surface</Text>
      <Flex direction="column" gap="2" p="4">
        <Alert status="info" icon={true} title="Alert on default surface" />
        <Alert status="success" icon={true} title="Alert on default surface" />
      </Flex>
    </Flex>

    <Flex direction="column" gap="4">
      <Text>On Surface 0</Text>
      <Flex direction="column" gap="2" surface="0" p="4">
        <Alert status="info" icon={true} title="Alert on surface 0" />
        <Alert status="success" icon={true} title="Alert on surface 0" />
      </Flex>
    </Flex>

    <Flex direction="column" gap="4">
      <Text>On Surface 1</Text>
      <Flex direction="column" gap="2" surface="1" p="4">
        <Alert status="info" icon={true} title="Alert on surface 1" />
        <Alert status="success" icon={true} title="Alert on surface 1" />
      </Flex>
    </Flex>

    <Flex direction="column" gap="4">
      <Text>On Surface 2</Text>
      <Flex direction="column" gap="2" surface="2" p="4">
        <Alert status="info" icon={true} title="Alert on surface 2" />
        <Alert status="success" icon={true} title="Alert on surface 2" />
      </Flex>
    </Flex>

    <Flex direction="column" gap="4">
      <Text>On Surface 3</Text>
      <Flex direction="column" gap="2" surface="3" p="4">
        <Alert status="info" icon={true} title="Alert on surface 3" />
        <Alert status="success" icon={true} title="Alert on surface 3" />
      </Flex>
    </Flex>
  </Flex>
);
`,...h.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{code:`const Responsive = () => (
  <Alert
    title="This alert changes status responsively"
    icon
    status={{
      initial: "info",
      sm: "success",
      md: "warning",
      lg: "danger",
    }}
  />
);
`,...f.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const WithUtilityProps = () => (
  <Box surface="1" py="4">
    <Alert
      status="success"
      icon={true}
      title="Alert with custom margin"
      mb="4"
      mx="4"
    />
    <Alert
      status="success"
      icon={true}
      title="Alert with custom margin"
      mx="4"
    />
  </Box>
);
`,...x.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'This is an alert message',
    icon: true
  }
})`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'This is an alert message'
  },
  parameters: {
    argTypes: {
      status: {
        control: false
      }
    }
  },
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={true} title="This is an informational alert with helpful information." />
      <Alert status="success" icon={true} title="Your changes have been saved successfully." />
      <Alert status="warning" icon={true} title="This action may have unintended consequences." />
      <Alert status="danger" icon={true} title="An error occurred while processing your request." />
    </Flex>
})`,...o.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={true} title="New Feature Available" description="We've added support for custom table columns. Check the documentation to learn more." />
      <Alert status="success" icon={true} title="Deployment Successful" description="Your application has been deployed to production. All health checks passed." />
      <Alert status="warning" icon={true} title="Pending Review" description="Please review the following items before proceeding with the deployment." />
      <Alert status="danger" icon={true} title="Authentication Failed" description="Unable to verify your credentials. Please check your username and password and try again." />
    </Flex>
})`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={false} title="This is an informational alert without an icon." />
      <Alert status="success" icon={false} title="Your changes have been saved successfully." />
      <Alert status="warning" icon={false} title="This action may have unintended consequences." />
      <Alert status="danger" icon={false} title="An error occurred while processing your request." />
    </Flex>
})`,...c.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={<RiCloudLine aria-hidden="true" />} title="This alert uses a custom cloud icon instead of the default info icon." />
      <Alert status="success" icon={<RiCloudLine aria-hidden="true" />} title="Custom icons work with any status variant." />
    </Flex>
})`,...m.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <Flex direction="column" gap="4">
      <Alert status="info" icon={true} title="This alert has a dismiss action on the right." customActions={<Button size="small" variant="tertiary">
            Dismiss
          </Button>} {...args} />
      <Alert status="success" icon={true} title="Your changes have been saved. Would you like to continue?" customActions={<>
            <Button size="small" variant="tertiary">
              Cancel
            </Button>
            <Button size="small" variant="primary">
              Continue
            </Button>
          </>} {...args} />
      <Alert status="danger" icon={true} title="An error occurred while processing your request. Please try again." customActions={<Button size="small" variant="primary">
            Retry
          </Button>} {...args} />
    </Flex>
})`,...r.input.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`WithActions.extend({
  args: {
    description: 'This is a description of the alert.'
  }
})`,...d.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Text>Info</Text>
      <Alert status="info" icon={true} loading title="Processing your request..." />

      <Text>Success</Text>
      <Alert status="success" icon={true} loading title="Saving changes..." />

      <Text>Warning</Text>
      <Alert status="warning" icon={true} loading title="Checking for issues..." />

      <Text>Danger</Text>
      <Alert status="danger" icon={true} loading title="Attempting recovery..." />
    </Flex>
})`,...p.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={true} loading title="Processing your request" description="This may take a few moments. Please do not close this window." />
      <Alert status="success" icon={true} loading title="Deployment in Progress" description="Your application is being deployed to production. You'll receive a notification when complete." />
    </Flex>
})`,...v.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={true} title="This is a longer alert message that demonstrates how the component handles multiple lines of text. The content will wrap naturally and maintain proper spacing with the icon and any actions. This is useful for providing detailed information to users when necessary." />
      <Alert status="warning" icon={true} title="This alert combines long content with actions. The actions remain aligned to the right even when the content wraps to multiple lines. This ensures a consistent and predictable layout regardless of content length." customActions={<Button size="small" variant="tertiary">
            Dismiss
          </Button>} />
    </Flex>
})`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Default Surface</Text>
        <Flex direction="column" gap="2" p="4">
          <Alert status="info" icon={true} title="Alert on default surface" />
          <Alert status="success" icon={true} title="Alert on default surface" />
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 0</Text>
        <Flex direction="column" gap="2" surface="0" p="4">
          <Alert status="info" icon={true} title="Alert on surface 0" />
          <Alert status="success" icon={true} title="Alert on surface 0" />
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 1</Text>
        <Flex direction="column" gap="2" surface="1" p="4">
          <Alert status="info" icon={true} title="Alert on surface 1" />
          <Alert status="success" icon={true} title="Alert on surface 1" />
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 2</Text>
        <Flex direction="column" gap="2" surface="2" p="4">
          <Alert status="info" icon={true} title="Alert on surface 2" />
          <Alert status="success" icon={true} title="Alert on surface 2" />
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 3</Text>
        <Flex direction="column" gap="2" surface="3" p="4">
          <Alert status="info" icon={true} title="Alert on surface 3" />
          <Alert status="success" icon={true} title="Alert on surface 3" />
        </Flex>
      </Flex>
    </Flex>
})`,...h.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'This alert changes status responsively',
    icon: true,
    status: {
      initial: 'info',
      sm: 'success',
      md: 'warning',
      lg: 'danger'
    }
  }
})`,...f.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Box surface="1" py="4">
      <Alert status="success" icon={true} title="Alert with custom margin" mb="4" mx="4" />
      <Alert status="success" icon={true} title="Alert with custom margin" mx="4" />
    </Box>
})`,...x.input.parameters?.docs?.source}}};const xe=["Default","StatusVariants","WithDescription","WithoutIcons","CustomIcon","WithActions","WithActionsAndDescriptions","LoadingVariants","LoadingWithDescription","LongContent","OnDifferentSurfaces","Responsive","WithUtilityProps"];export{m as CustomIcon,s as Default,p as LoadingVariants,v as LoadingWithDescription,g as LongContent,h as OnDifferentSurfaces,f as Responsive,o as StatusVariants,r as WithActions,d as WithActionsAndDescriptions,u as WithDescription,x as WithUtilityProps,c as WithoutIcons,xe as __namedExportsOrder};
