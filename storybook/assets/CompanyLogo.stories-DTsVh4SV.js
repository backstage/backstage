import{j as t,U as a,V as c,W as g,m as l}from"./iframe-DDK8UA9d.js";import{b as i,r as d}from"./plugin-vSac1J8y.js";import{S as s}from"./Grid-D0K-a10_.js";import{w as u}from"./appWrappers-BAKca1UY.js";import{T as f}from"./TemplateBackstageLogo-CVX93oY6.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-B8rIXpyP.js";import"./componentData-DVCIxwRf.js";import"./useAnalytics-BzcY6zQX.js";import"./useApp-CEEPe1BL.js";import"./useRouteRef-B6R72X7Y.js";import"./index-BCCOFm5P.js";import"./InfoCard-DdFVwzRm.js";import"./CardContent-D3M8ALUj.js";import"./ErrorBoundary-DfU1mqPq.js";import"./ErrorPanel-BQD939bd.js";import"./WarningPanel-DXNyXfzl.js";import"./ExpandMore-BnojTJh7.js";import"./AccordionDetails-BmHvpTHX.js";import"./index-B9sM2jn7.js";import"./Collapse-Bm6nVpbB.js";import"./MarkdownContent-CG88u8fu.js";import"./CodeSnippet-DWhhZEwi.js";import"./Box-DhjbYf3r.js";import"./styled-DMKPGzcT.js";import"./CopyTextButton-Chq4JcN0.js";import"./useCopyToClipboard-DbGzp7uW.js";import"./useMountedState-Dd9a9K3Q.js";import"./Tooltip-Cy4RFEYG.js";import"./Popper-BHoeK-6N.js";import"./Portal-DcnhuCwR.js";import"./List-DFzXqQTw.js";import"./ListContext-Gb2XOrAs.js";import"./ListItem-DLPNurIO.js";import"./ListItemText-C4llEuCJ.js";import"./LinkButton-Szn1P8QE.js";import"./Link-D2O1VvQJ.js";import"./lodash-Czox7iJy.js";import"./Button-BX1FqlVG.js";import"./CardHeader-DKd_bJm5.js";import"./Divider-b4tOLF1T.js";import"./CardActions-CMH4xMES.js";import"./BottomLink-DGft6KEe.js";import"./ArrowForward-Dp8lxvtT.js";import"./DialogTitle-BTPhbLnL.js";import"./Modal-BvYRzzOq.js";import"./Backdrop-Dzo24YRx.js";import"./useObservable-lrBRJVS5.js";import"./useIsomorphicLayoutEffect-DQLGKQw-.js";import"./useAsync-Cu7_HYMF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const Co=["Default","CustomLogo"];export{e as CustomLogo,r as Default,Co as __namedExportsOrder,yo as default};
