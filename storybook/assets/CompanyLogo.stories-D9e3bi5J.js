import{j as t,T as a,c,C as g,m as l}from"./iframe-hd6BgcQH.js";import{b as i,r as d}from"./plugin-92FY2VfE.js";import{S as s}from"./Grid-C4Dm4yGa.js";import{w as u}from"./appWrappers-Ci8V8MLf.js";import{T as f}from"./TemplateBackstageLogo-BkUYWWAG.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-iM4X_t4D.js";import"./componentData-Cp5cye-b.js";import"./useAnalytics-BNw5WHP5.js";import"./useApp-D57mFECn.js";import"./useRouteRef-BFQKnc9G.js";import"./index-BvioCNb0.js";import"./InfoCard-DXQ7_Apb.js";import"./CardContent-Da9FNRpD.js";import"./ErrorBoundary-BxDyxJNA.js";import"./ErrorPanel-pwFCh6zc.js";import"./WarningPanel-Le2tKfrN.js";import"./ExpandMore-C7-67hd9.js";import"./AccordionDetails-DosuP5Ed.js";import"./index-DnL3XN75.js";import"./Collapse-D-UdipB4.js";import"./MarkdownContent-aZlBpoZT.js";import"./CodeSnippet-BlQm8FHA.js";import"./Box-C4_Hx4tK.js";import"./styled-Csv0DLFw.js";import"./CopyTextButton-C8AIAO8L.js";import"./useCopyToClipboard-ZIjVTeCY.js";import"./useMountedState-BwuO-QSl.js";import"./Tooltip-DHFXXWJ1.js";import"./Popper-BLI_ywQx.js";import"./Portal-QtjodaYU.js";import"./List-Eydl9qQR.js";import"./ListContext-DMV1tqqG.js";import"./ListItem-BuICECdF.js";import"./ListItemText-B0MXj_oA.js";import"./LinkButton-DUOFEHwI.js";import"./Button-3MbgNa_D.js";import"./Link-DIsoXdRS.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-ChJbkXh1.js";import"./Divider-BsrVsHFl.js";import"./CardActions-Ci4WOTdw.js";import"./BottomLink-BlsHV6Ti.js";import"./ArrowForward-Bdq2LjKG.js";import"./DialogTitle-BJGjv1lD.js";import"./Modal-DC-l3nZj.js";import"./Backdrop-TGnaLO6W.js";import"./useObservable-C2Ift1hU.js";import"./useAsync-DlvFpJJJ.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const fo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
