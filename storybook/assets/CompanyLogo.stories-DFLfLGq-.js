import{j as t,U as a,V as c,W as g,m as l}from"./iframe-M9O-K8SB.js";import{b as i,r as d}from"./plugin-CYmgpVyh.js";import{S as s}from"./Grid-DxciBpqo.js";import{w as u}from"./appWrappers-k5-JRCH3.js";import{T as f}from"./TemplateBackstageLogo-DNV_DR7P.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CnPMefJ2.js";import"./componentData-lwFigNXQ.js";import"./useAnalytics-8ya555GT.js";import"./useApp-Citse85p.js";import"./useRouteRef-BuU8-jzQ.js";import"./index-CuiKZooy.js";import"./InfoCard-DsauPiav.js";import"./CardContent-CW06YTYP.js";import"./ErrorBoundary-DxLHiv0j.js";import"./ErrorPanel-DmuSnSG8.js";import"./WarningPanel-BNg1npDI.js";import"./ExpandMore-BQg6NhWn.js";import"./AccordionDetails-C-b5rZIs.js";import"./index-B9sM2jn7.js";import"./Collapse-yN0IR1ZS.js";import"./MarkdownContent-CYUmriLW.js";import"./CodeSnippet-BQZTwjqk.js";import"./Box-DrVgjJoD.js";import"./styled-Ddkk_tuK.js";import"./CopyTextButton-D94RjEoK.js";import"./useCopyToClipboard-BSGGLx0n.js";import"./useMountedState-CLl1ZXx0.js";import"./Tooltip-Bg-nqDOZ.js";import"./Popper-BxqJldSX.js";import"./Portal-B9990TVI.js";import"./List-DFXlWgcm.js";import"./ListContext-CQy2fJuy.js";import"./ListItem-CccU-wMK.js";import"./ListItemText-OpvVVx-v.js";import"./LinkButton-71uZgpqj.js";import"./Link-Btc0GL0z.js";import"./lodash-Czox7iJy.js";import"./Button-JPiqA3bT.js";import"./CardHeader-PYk2WpzE.js";import"./Divider-O5bh-cJ-.js";import"./CardActions-DH8NqYkM.js";import"./BottomLink-BsHjsdIF.js";import"./ArrowForward-DAkk1QjY.js";import"./DialogTitle-BJV9GWqg.js";import"./Modal-Bu63BRBX.js";import"./Backdrop-D_SJu6io.js";import"./useObservable-CuDF8Tct.js";import"./useIsomorphicLayoutEffect-9yTSWmeM.js";import"./useAsync-CFnaQwpM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
