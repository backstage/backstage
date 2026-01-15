import{j as t,T as a,c,C as g,m as l}from"./iframe-Ca4Oq2uP.js";import{b as i,r as d}from"./plugin-DmM0PbHN.js";import{S as s}from"./Grid-DvRbNd4W.js";import{w as u}from"./appWrappers-DhOSUPKL.js";import{T as f}from"./TemplateBackstageLogo-B8_U-IQX.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Gf4U2wcG.js";import"./componentData-CRvdRyiq.js";import"./useAnalytics-BO6qv_N6.js";import"./useApp-CIEu2n9t.js";import"./useRouteRef-BGRvnXy4.js";import"./index-CWD4-Z7Q.js";import"./InfoCard-CTsToJIt.js";import"./CardContent-BhfeUuXc.js";import"./ErrorBoundary-Do1MdOmP.js";import"./ErrorPanel-B9MZJL52.js";import"./WarningPanel-D_gQNl9J.js";import"./ExpandMore-BYyl-nAO.js";import"./AccordionDetails-C-jAEpJA.js";import"./index-B9sM2jn7.js";import"./Collapse-B_fsMJ0G.js";import"./MarkdownContent-CCSCaS3C.js";import"./CodeSnippet-BNIZNbBb.js";import"./Box-C6YthH4K.js";import"./styled-bS2mVuuT.js";import"./CopyTextButton-CxyLRgr5.js";import"./useCopyToClipboard-CrLUyXrt.js";import"./useMountedState-am8g5938.js";import"./Tooltip-DlFbz0wm.js";import"./Popper-D7At4psl.js";import"./Portal-DfnbqdYt.js";import"./List-_jXEyBxC.js";import"./ListContext-DFKFAB0C.js";import"./ListItem-BrncrmWC.js";import"./ListItemText-VT7wc13t.js";import"./LinkButton-C2Y4nle9.js";import"./Button-lNm9l9il.js";import"./Link-C9Yjpk8V.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-CP6xFFSM.js";import"./Divider-I0xPhLEa.js";import"./CardActions-EN8qOMz-.js";import"./BottomLink-CRrKsmqK.js";import"./ArrowForward-CTfGuzv6.js";import"./DialogTitle-DcpjkfLf.js";import"./Modal-DNybagJK.js";import"./Backdrop-B0S7DZUH.js";import"./useObservable-D5OlgkuN.js";import"./useIsomorphicLayoutEffect-D_xlHkKu.js";import"./useAsync-DQa5qi3g.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
