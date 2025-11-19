import{j as t,T as a,c,C as g,m as l}from"./iframe-C4dPZ8kl.js";import{b as i,r as d}from"./plugin-DyYk1xMB.js";import{S as s}from"./Grid-CZkThu2A.js";import{w as u}from"./appWrappers-7vg0hiAv.js";import{T as f}from"./TemplateBackstageLogo-wCYY5LD6.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CK7oqw3K.js";import"./componentData-DMZccOUa.js";import"./useAnalytics-DSRHfRk8.js";import"./useApp-DcP6b98f.js";import"./useRouteRef-BQcipW1o.js";import"./index-D_dzg66M.js";import"./InfoCard-fptdlUM7.js";import"./CardContent-BvLIKHM3.js";import"./ErrorBoundary-CbSR2es8.js";import"./ErrorPanel-f98hRRjB.js";import"./WarningPanel-UrVVQWJv.js";import"./ExpandMore-DDjBqXKI.js";import"./AccordionDetails-Ce7Lmoz_.js";import"./index-DnL3XN75.js";import"./Collapse-CJN8yhuQ.js";import"./MarkdownContent-DRc5DkYJ.js";import"./CodeSnippet-B1XiwaHz.js";import"./Box-COTlPoNf.js";import"./styled-ie_8oXYP.js";import"./CopyTextButton-ENp4DaQL.js";import"./useCopyToClipboard-CFD3RXQw.js";import"./useMountedState-Cn7zfAE-.js";import"./Tooltip-BFnVM2Xk.js";import"./Popper-0_gUpV4D.js";import"./Portal-C3KrmcYH.js";import"./List-CsFCwjIb.js";import"./ListContext-CZ3AIdLK.js";import"./ListItem-Bx6LKxKb.js";import"./ListItemText-BtakqwiJ.js";import"./LinkButton-DQDnYx_t.js";import"./Button-Bagr9kg6.js";import"./Link-qsu39Qum.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-dQebxsoQ.js";import"./Divider-BRNaSJ60.js";import"./CardActions-CqEpFnAU.js";import"./BottomLink-CPG2W-HG.js";import"./ArrowForward-nOblFUSu.js";import"./DialogTitle-B_WNMW88.js";import"./Modal-Ch6lvVax.js";import"./Backdrop-CYIUSPea.js";import"./useObservable-ucvHRIwK.js";import"./useIsomorphicLayoutEffect-DxvvdXSg.js";import"./useAsync-DoJxcUlb.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
