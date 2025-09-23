import{j as t,T as a,c,C as g,m as l}from"./iframe-Ca7Z-L4G.js";import{b as i,r as d}from"./plugin-BeYxo7k0.js";import{S as s}from"./Grid-auHuq8r2.js";import{w as u}from"./appWrappers-DRvX8LbQ.js";import{T as f}from"./TemplateBackstageLogo-o5FiFd7G.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-C1QQDTm-.js";import"./componentData-_1Qfjr2u.js";import"./useAnalytics-B4tVP_DV.js";import"./useApp-CAw2wdK9.js";import"./useRouteRef-DDQzGExo.js";import"./index-BJKCiffA.js";import"./InfoCard-6yqF4ElN.js";import"./CardContent-BzSwagcs.js";import"./ErrorBoundary-DMJmqIzN.js";import"./ErrorPanel-zLmvMY6B.js";import"./WarningPanel-DU1kckLo.js";import"./ExpandMore-CMMWGbBw.js";import"./AccordionDetails-CcpJ8mhZ.js";import"./index-DnL3XN75.js";import"./Collapse-n2Kb8itc.js";import"./MarkdownContent-CoRCbhDs.js";import"./CodeSnippet-BKse1xIH.js";import"./Box-BAIj98gt.js";import"./styled-C18e2gIS.js";import"./CopyTextButton-DcJl0ww3.js";import"./useCopyToClipboard-vqdrk62a.js";import"./useMountedState-CV_rLf93.js";import"./Tooltip-BxH5cU7h.js";import"./Popper-BHTXlPRY.js";import"./Portal-BioI0xEQ.js";import"./List-CZA5eH2K.js";import"./ListContext-B_Im9Dn6.js";import"./ListItem-C9nJC85u.js";import"./ListItemText-DZSn-Gas.js";import"./LinkButton-BKXHaC2U.js";import"./Button-C4GDJaSU.js";import"./Link-D6f9g5gT.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-C6vdyhr0.js";import"./Divider-zG-YiM3h.js";import"./CardActions-DoALoamq.js";import"./BottomLink-By8FPf_G.js";import"./ArrowForward-DUXpUVfv.js";import"./DialogTitle-CdHDbEvu.js";import"./Modal-DgmZg7sP.js";import"./Backdrop-DXmAjQVD.js";import"./useObservable-DntrMzpR.js";import"./useIsomorphicLayoutEffect-C-EeS4cl.js";import"./useAsync-DSkJAg62.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
