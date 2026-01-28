import{j as t,T as a,c,C as g,m as l}from"./iframe-Bnzrr9GJ.js";import{b as i,r as d}from"./plugin-DML38mmW.js";import{S as s}from"./Grid-yfENroGK.js";import{w as u}from"./appWrappers-VyQoo8wK.js";import{T as f}from"./TemplateBackstageLogo-uxxM3viP.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D_YG91mq.js";import"./componentData-q9jR-RmB.js";import"./useAnalytics-0uTDec9U.js";import"./useApp-SixTcc6z.js";import"./useRouteRef-BIDrbivK.js";import"./index-CYC8aWCi.js";import"./InfoCard-B2jLnxg1.js";import"./CardContent-CQJGZ3r6.js";import"./ErrorBoundary-DFuYykN9.js";import"./ErrorPanel-CD5X405H.js";import"./WarningPanel-CiGAMcSc.js";import"./ExpandMore-lB9NR-kr.js";import"./AccordionDetails-CuEuFzda.js";import"./index-B9sM2jn7.js";import"./Collapse-Bk6-UMMi.js";import"./MarkdownContent-uyUP_FU2.js";import"./CodeSnippet-CNEmId6n.js";import"./Box-_ldnD672.js";import"./styled-ECwvL4gF.js";import"./CopyTextButton-h_AlfJlB.js";import"./useCopyToClipboard-C1DHvlyv.js";import"./useMountedState-BCp4s1hj.js";import"./Tooltip-BNoXxCwH.js";import"./Popper-xM2ICnpy.js";import"./Portal-7sPWK5aa.js";import"./List-C5zGpaSP.js";import"./ListContext-BS9Mebja.js";import"./ListItem-WNmrdDGe.js";import"./ListItemText-CaCse6tD.js";import"./LinkButton-C4SkPNpD.js";import"./Link-B2CkVKPO.js";import"./lodash-Czox7iJy.js";import"./Button-C4wuUHK5.js";import"./CardHeader-D0WzuIfd.js";import"./Divider-Dygs3iK7.js";import"./CardActions-BwdKTwvs.js";import"./BottomLink-BBfeMbVs.js";import"./ArrowForward-KRJIM6Q4.js";import"./DialogTitle-B57sbJyb.js";import"./Modal-C9035a_p.js";import"./Backdrop-U11n_nYY.js";import"./useObservable-DuLbtCIZ.js";import"./useIsomorphicLayoutEffect-BBA0B-Gu.js";import"./useAsync-Cf2YmW8g.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
