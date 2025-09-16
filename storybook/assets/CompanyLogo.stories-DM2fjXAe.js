import{j as t,T as a,c,C as g,m as l}from"./iframe-PR9K1gR4.js";import{b as i,r as d}from"./plugin-CJzI0Twe.js";import{S as s}from"./Grid-BDCj0xnW.js";import{w as u}from"./appWrappers-DEOTEiR9.js";import{T as f}from"./TemplateBackstageLogo-CuKEnRP6.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DNmMI31j.js";import"./componentData-o86LZs6r.js";import"./useAnalytics-D2YlE8CY.js";import"./useApp-BW5Yca7D.js";import"./useRouteRef-B521NRec.js";import"./index-qP2Hr3Qu.js";import"./InfoCard-BsnUWDGu.js";import"./CardContent-D7oLkQ_y.js";import"./ErrorBoundary-Cp4UMxdi.js";import"./ErrorPanel-wKrI7pp5.js";import"./WarningPanel-BdWxPo3h.js";import"./ExpandMore-C65eZJGL.js";import"./AccordionDetails-C_jBxEzP.js";import"./index-DnL3XN75.js";import"./Collapse-B00qmsYa.js";import"./MarkdownContent-CPx5kcko.js";import"./CodeSnippet-BcyQuG45.js";import"./Box-DE3El2Us.js";import"./styled-BWfK9xAq.js";import"./CopyTextButton-EKDV7SOv.js";import"./useCopyToClipboard-Dv8Ke7sP.js";import"./useMountedState-9lLipg6w.js";import"./Tooltip-NKLLE1oV.js";import"./Popper-C2P8lryL.js";import"./Portal-CHANQNTr.js";import"./List-9O5jesKH.js";import"./ListContext-d9I9drbR.js";import"./ListItem-BSmKrE7c.js";import"./ListItemText-BDaGpWdO.js";import"./LinkButton-DfUc1wjm.js";import"./Button-DAulvpLo.js";import"./Link-8mF5gqTh.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-BkJyBP81.js";import"./Divider-C49XG7LX.js";import"./CardActions-BBsiP_-o.js";import"./BottomLink-D_BnnSpC.js";import"./ArrowForward-B-qxFdBl.js";import"./DialogTitle-B59kuhfC.js";import"./Modal-DgU04yZ2.js";import"./Backdrop-B3ZiF5N6.js";import"./useObservable-BhXF4yMN.js";import"./useAsync-CdCMGCNf.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const fo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
