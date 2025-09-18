import{j as t,T as a,c,C as g,m as l}from"./iframe-COb0l9Ot.js";import{b as i,r as d}from"./plugin-BF5haQ0y.js";import{S as s}from"./Grid-YEqTPm11.js";import{w as u}from"./appWrappers-CUP1_xOq.js";import{T as f}from"./TemplateBackstageLogo-CO9gsNTl.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-d8SAvW_D.js";import"./componentData-BMcw6RgA.js";import"./useAnalytics-BEClZYF1.js";import"./useApp-DOIE3BzV.js";import"./useRouteRef-B3C5BO0J.js";import"./index-C2rNmFdC.js";import"./InfoCard-D7qgUOA3.js";import"./CardContent-Dv8QIF22.js";import"./ErrorBoundary-DODDDLR0.js";import"./ErrorPanel-BXUGmJvH.js";import"./WarningPanel-CNUUwcSO.js";import"./ExpandMore-DzIoUaMP.js";import"./AccordionDetails-xHtvINQ6.js";import"./index-DnL3XN75.js";import"./Collapse-DKLG8K48.js";import"./MarkdownContent-DWCHMYxR.js";import"./CodeSnippet-DUq6zHFn.js";import"./Box-DdeU9hBZ.js";import"./styled-COzJBZos.js";import"./CopyTextButton-L7Y3IiwS.js";import"./useCopyToClipboard-Bc2Muk56.js";import"./useMountedState-BCYouEnX.js";import"./Tooltip-DiHf9MQ-.js";import"./Popper-Jg-KIdHc.js";import"./Portal-DhkyDrOm.js";import"./List-C_SD4FZR.js";import"./ListContext-C2fYDrJh.js";import"./ListItem-BXV5PRVp.js";import"./ListItemText-Cpgtr8oy.js";import"./LinkButton-CXB10pz2.js";import"./Button-2GtkzPEz.js";import"./Link-Ct1evR27.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-Bx-1HdmL.js";import"./Divider-DBtusLcX.js";import"./CardActions-DeYkfajh.js";import"./BottomLink-LHhWavGh.js";import"./ArrowForward-BIQnZ3Mi.js";import"./DialogTitle-B1Fp7DaC.js";import"./Modal-Da3_mpt5.js";import"./Backdrop-DvB5sMhK.js";import"./useObservable-GPFeSMKQ.js";import"./useAsync-Ove48rSA.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const fo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const {
    container
  } = useLogoStyles();
  return <Grid container justifyContent="center" spacing={6}>
      <HomePageCompanyLogo className={container} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    container,
    svg,
    path
  } = useLogoStyles();
  return <Grid container justifyContent="center" spacing={6}>
      <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
      svg,
      path
    }} />} />
    </Grid>;
}`,...e.parameters?.docs?.source}}};const yo=["Default","CustomLogo"];export{e as CustomLogo,r as Default,yo as __namedExportsOrder,fo as default};
