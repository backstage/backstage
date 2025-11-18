import{j as t,T as a,c,C as g,m as l}from"./iframe-BJLAQiny.js";import{b as i,r as d}from"./plugin-B5ZLJ7gh.js";import{S as s}from"./Grid-85KaXqj6.js";import{w as u}from"./appWrappers-Ch3ZwAuI.js";import{T as f}from"./TemplateBackstageLogo-DL4dA9oW.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CG7_4OWW.js";import"./componentData-Bg3JyZcy.js";import"./useAnalytics-W203HJ0-.js";import"./useApp-BTkCnRE2.js";import"./useRouteRef-CVo3EImE.js";import"./index-bnZRQeHC.js";import"./InfoCard-yPFTnu1Z.js";import"./CardContent-C84WVsF3.js";import"./ErrorBoundary-iG0FMg2_.js";import"./ErrorPanel-C7O53zca.js";import"./WarningPanel-Cx0u9N3G.js";import"./ExpandMore-C9SKMfwh.js";import"./AccordionDetails-BeK8TLKU.js";import"./index-DnL3XN75.js";import"./Collapse-Dyo3yIeQ.js";import"./MarkdownContent-C9K6rk9j.js";import"./CodeSnippet-BCiMU4qs.js";import"./Box-DBjVidWA.js";import"./styled-Dbum34QX.js";import"./CopyTextButton-qCRVuup2.js";import"./useCopyToClipboard-WIY93EcD.js";import"./useMountedState-DW1n1H5-.js";import"./Tooltip-DWt_B2xO.js";import"./Popper-DQtSbLkc.js";import"./Portal-B2YIacrT.js";import"./List-DMFoD1Fa.js";import"./ListContext-HC4v7bkz.js";import"./ListItem-Ccj_bLuX.js";import"./ListItemText-B0trVnJh.js";import"./LinkButton-B7rqQyTO.js";import"./Button-CtgRUIFg.js";import"./Link-BsQxZTCc.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-DOZJLl26.js";import"./Divider-DsKh9GaH.js";import"./CardActions-Cs4T3KjN.js";import"./BottomLink-Wm-pDfIj.js";import"./ArrowForward-Ds6zgypX.js";import"./DialogTitle-BYsWp0dH.js";import"./Modal-98ZwNGha.js";import"./Backdrop-BKPXV1ri.js";import"./useObservable-DxZEzPKu.js";import"./useIsomorphicLayoutEffect-YDmtHS5G.js";import"./useAsync-D_PwxK1T.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
