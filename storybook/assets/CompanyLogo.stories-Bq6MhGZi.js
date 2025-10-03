import{j as t,T as a,c,C as g,m as l}from"./iframe-Dl820wOI.js";import{b as i,r as d}from"./plugin-BaRFzbFH.js";import{S as s}from"./Grid-BlSwvCAu.js";import{w as u}from"./appWrappers-BD3uh5nl.js";import{T as f}from"./TemplateBackstageLogo-B2O1yzkz.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-3vtTV61V.js";import"./componentData-9E7-GlxJ.js";import"./useAnalytics-H66oe0oN.js";import"./useApp-B5QaOHzA.js";import"./useRouteRef-C9mydBcp.js";import"./index-Dc9OD8OQ.js";import"./InfoCard-Bz2zmd-3.js";import"./CardContent-BbppD0Sf.js";import"./ErrorBoundary-TU5r1TN3.js";import"./ErrorPanel-Bkv9ZIFz.js";import"./WarningPanel-CQQpX2Kh.js";import"./ExpandMore-BlvUDGnA.js";import"./AccordionDetails-vMLxVx9E.js";import"./index-DnL3XN75.js";import"./Collapse-s2rcogEo.js";import"./MarkdownContent-Cgb47FM9.js";import"./CodeSnippet-C8tyMWnK.js";import"./Box-DfeHQWeE.js";import"./styled-kfqHWboF.js";import"./CopyTextButton-Dfef_A-E.js";import"./useCopyToClipboard-y5aTqnvo.js";import"./useMountedState-C0tKh2p0.js";import"./Tooltip-DqMu2rNF.js";import"./Popper-CWjD6Kfi.js";import"./Portal-jLwVh-5o.js";import"./List-CHKnkhL9.js";import"./ListContext-Cbtrueie.js";import"./ListItem-Bj_ICtqE.js";import"./ListItemText-D5ck7_4o.js";import"./LinkButton-C-wRK3uh.js";import"./Button-BNshOWAl.js";import"./Link-BTOOY6TC.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-DGlc83ja.js";import"./Divider-BgKPwKXb.js";import"./CardActions-DERKWDxO.js";import"./BottomLink-CrHLb6uy.js";import"./ArrowForward-Bcalu6Is.js";import"./DialogTitle-CxtWIpkN.js";import"./Modal-DWfTsRMv.js";import"./Backdrop-BMrQTwpi.js";import"./useObservable-C0M1HCkm.js";import"./useIsomorphicLayoutEffect-BfWFNjzn.js";import"./useAsync-BnrwJMnZ.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
