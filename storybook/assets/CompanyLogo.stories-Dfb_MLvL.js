import{j as t,U as a,V as c,W as g,m as l}from"./iframe-DPEQU9sg.js";import{b as i,r as d}from"./plugin-CiOkNlA6.js";import{S as s}from"./Grid-V2KC8DrR.js";import{w as u}from"./appWrappers-Bk2njHpK.js";import{T as f}from"./TemplateBackstageLogo-weDcCk0X.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Dd2xY8WF.js";import"./componentData-DiYtav-w.js";import"./useAnalytics-odk5YTGP.js";import"./useApp-WY7YhADn.js";import"./useRouteRef-PDyeC6uZ.js";import"./index-9w1oJKxU.js";import"./InfoCard-UXrjSJZz.js";import"./CardContent-BpROYwkn.js";import"./ErrorBoundary--PVZ3Kye.js";import"./ErrorPanel-Bv595yjm.js";import"./WarningPanel-C_F8xUzg.js";import"./ExpandMore-D_QIxzGY.js";import"./AccordionDetails-0XhIBkyu.js";import"./index-B9sM2jn7.js";import"./Collapse-ggEsDBaY.js";import"./MarkdownContent-D28GpyhI.js";import"./CodeSnippet-DGpkezw4.js";import"./Box-DFPXS1uh.js";import"./styled-_ZhQ2JBl.js";import"./CopyTextButton-CyVbES63.js";import"./useCopyToClipboard-D4G45ymZ.js";import"./useMountedState-BqkaBMSv.js";import"./Tooltip-1rkaBdpM.js";import"./Popper-BxGyCUHY.js";import"./Portal-AonZoDqn.js";import"./List-DquDfnLJ.js";import"./ListContext-DyGfW3pa.js";import"./ListItem-C3tAmyko.js";import"./ListItemText-xJVltyzR.js";import"./LinkButton-BMSs3eBp.js";import"./Link-DnuEQx-0.js";import"./lodash-Czox7iJy.js";import"./Button-B3E66A3B.js";import"./CardHeader-CcWBi4cR.js";import"./Divider-DubjQnze.js";import"./CardActions-CpqUN02Z.js";import"./BottomLink-DBqGzdk2.js";import"./ArrowForward-B3AD257j.js";import"./DialogTitle-8oe1SRUv.js";import"./Modal-BY3dMB2D.js";import"./Backdrop-BZwF8N70.js";import"./useObservable-Bl5WmSl_.js";import"./useIsomorphicLayoutEffect-8D8X83kR.js";import"./useAsync-BqETPqxv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
