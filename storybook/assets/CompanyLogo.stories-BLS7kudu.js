import{j as t,U as a,V as c,W as g,m as l}from"./iframe-CJaWlx9k.js";import{b as i,r as d}from"./plugin-HC6L5CqT.js";import{S as s}from"./Grid-CvrlVjPi.js";import{w as u}from"./appWrappers-KXpf8wG0.js";import{T as f}from"./TemplateBackstageLogo-Cz_lBmnX.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CYNhPwzU.js";import"./componentData-DJazsba3.js";import"./useAnalytics-B9VoDArS.js";import"./useApp-C3Rn7vNb.js";import"./useRouteRef-DSloxSH6.js";import"./index-BQ0Bm2RY.js";import"./InfoCard-Dwr3nloC.js";import"./CardContent-Cz50hYBX.js";import"./ErrorBoundary-Tzl3QUgw.js";import"./ErrorPanel-B3gEy6QN.js";import"./WarningPanel-Bt3VBM0r.js";import"./ExpandMore-C8_7pfNC.js";import"./AccordionDetails-rBd-wslk.js";import"./index-B9sM2jn7.js";import"./Collapse-Do9YA9sk.js";import"./MarkdownContent-BbMUo3g_.js";import"./CodeSnippet-7H2Sad9p.js";import"./Box-C7QC6pzn.js";import"./styled-CZ7JF9wM.js";import"./CopyTextButton-BT4ENnB_.js";import"./useCopyToClipboard-D8QOZa6n.js";import"./useMountedState-BX2n2ffy.js";import"./Tooltip-BdyP1fjK.js";import"./Popper-D3Zb46nS.js";import"./Portal-CCaSbatU.js";import"./List-CG61H5Q6.js";import"./ListContext-BgC5EWvT.js";import"./ListItem-C89Oh5hh.js";import"./ListItemText-DiADD6kG.js";import"./LinkButton-5bxMHofQ.js";import"./Link-BT9-PDsb.js";import"./lodash-Czox7iJy.js";import"./Button-BIo1VJpq.js";import"./CardHeader-C3-hJvDl.js";import"./Divider-iZOmm7wk.js";import"./CardActions-BgceOLG0.js";import"./BottomLink-Dm0y6uih.js";import"./ArrowForward-DYtCoeK4.js";import"./DialogTitle-Ddd7NJfh.js";import"./Modal-DA7gw75D.js";import"./Backdrop-Br04yFLt.js";import"./useObservable-Ci9nj0uo.js";import"./useIsomorphicLayoutEffect-DaQ9vgb_.js";import"./useAsync-BIkYo0dn.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
