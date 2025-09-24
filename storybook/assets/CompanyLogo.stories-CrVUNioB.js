import{j as t,T as a,c,C as g,m as l}from"./iframe-Dyaavudc.js";import{b as i,r as d}from"./plugin-B7b2_-xI.js";import{S as s}from"./Grid-yjQsuTcw.js";import{w as u}from"./appWrappers-BwtxeNt8.js";import{T as f}from"./TemplateBackstageLogo-HuGxc7MC.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BsRKYY6H.js";import"./componentData-mOOEbSJD.js";import"./useAnalytics-DFiGEzjB.js";import"./useApp-zMMbOjHG.js";import"./useRouteRef-CDGbELMm.js";import"./index-QN8QI6Oa.js";import"./InfoCard-DK6hsUUn.js";import"./CardContent-CjCki9P1.js";import"./ErrorBoundary-CbyPL_-Y.js";import"./ErrorPanel-B2YZjnJe.js";import"./WarningPanel-D7uKb3M5.js";import"./ExpandMore-4_EAOpPR.js";import"./AccordionDetails-D6NyoHkL.js";import"./index-DnL3XN75.js";import"./Collapse-C_ACyz1D.js";import"./MarkdownContent-B1fiby4H.js";import"./CodeSnippet-CvU93WqX.js";import"./Box-BBMZCdvE.js";import"./styled-DUE4Vhg9.js";import"./CopyTextButton-BAX6zuMk.js";import"./useCopyToClipboard-LvANOgWh.js";import"./useMountedState-Ca6tx6sG.js";import"./Tooltip-Ty7zpOlh.js";import"./Popper-DhZ8DQVo.js";import"./Portal-CUQx1RGJ.js";import"./List-CD5TLS8H.js";import"./ListContext-tHxur0ox.js";import"./ListItem-Cw_mLBpk.js";import"./ListItemText-C5HwvlyG.js";import"./LinkButton-CK_Oj2Uu.js";import"./Button-p78_XACY.js";import"./Link-BzX_mGVi.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CdFGMhF2.js";import"./Divider-CazGSVhv.js";import"./CardActions-CWomgJq0.js";import"./BottomLink-BaDCUbTb.js";import"./ArrowForward-BJ4TDo_a.js";import"./DialogTitle-BgPww_-x.js";import"./Modal-CXTgK8no.js";import"./Backdrop-BD2Exnk-.js";import"./useObservable-BBC86g22.js";import"./useIsomorphicLayoutEffect-DkTgiNn7.js";import"./useAsync-Cwh-MG41.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
