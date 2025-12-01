import{j as t,T as a,c,C as g,m as l}from"./iframe-B07WZXM3.js";import{b as i,r as d}from"./plugin-Cky38OIy.js";import{S as s}from"./Grid-BY5Lob_Q.js";import{w as u}from"./appWrappers-CY9OeE-D.js";import{T as f}from"./TemplateBackstageLogo-0S3DHxDz.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CZOVJjYF.js";import"./componentData-DQzB6vVe.js";import"./useAnalytics-CVMEzOss.js";import"./useApp-K3As38vi.js";import"./useRouteRef-YqSqr-8_.js";import"./index-BxkUEN8z.js";import"./InfoCard-F0p-l5uK.js";import"./CardContent-Di1P8Mmg.js";import"./ErrorBoundary-C0cY3uRo.js";import"./ErrorPanel-ayETAGhj.js";import"./WarningPanel-DImNnyuV.js";import"./ExpandMore-Da5XW09b.js";import"./AccordionDetails-B-vBZmTY.js";import"./index-DnL3XN75.js";import"./Collapse-Bc-VFX1u.js";import"./MarkdownContent-CcNYv7l1.js";import"./CodeSnippet-BxcFip7J.js";import"./Box-BLhfQJZZ.js";import"./styled-DWF50Q3F.js";import"./CopyTextButton-xE5t_wDk.js";import"./useCopyToClipboard-2MhLRliJ.js";import"./useMountedState-BHHklG7n.js";import"./Tooltip-CZw4hPcl.js";import"./Popper-DRLEgsx8.js";import"./Portal-XA5rRvQB.js";import"./List-NEqxYc-i.js";import"./ListContext-DoxtYS94.js";import"./ListItem-CbK_QR24.js";import"./ListItemText-BnYxYQrd.js";import"./LinkButton-C9NGk5Cj.js";import"./Button-CyuaBLDC.js";import"./Link-BSdi_-Cv.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-D4MCyAu5.js";import"./Divider-MyjmiSrT.js";import"./CardActions-DK9Pnp_M.js";import"./BottomLink-DRJDK7sA.js";import"./ArrowForward-C1CbMcYH.js";import"./DialogTitle-D75WnviF.js";import"./Modal-C4lsEVR2.js";import"./Backdrop-BhjMJ7cT.js";import"./useObservable-BmNeYwoO.js";import"./useIsomorphicLayoutEffect-BK_xBPGN.js";import"./useAsync-DCstABRD.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
