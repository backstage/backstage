import{j as t,T as a,c,C as g,m as l}from"./iframe-DFdcbEiJ.js";import{b as i,r as d}from"./plugin-DOwt9FZS.js";import{S as s}from"./Grid-Bz80tPVF.js";import{w as u}from"./appWrappers-DpruEjTR.js";import{T as f}from"./TemplateBackstageLogo-zpy5RtTt.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Bs6oqM75.js";import"./componentData-DKayDtyx.js";import"./useAnalytics-CExwtm2Z.js";import"./useApp--XwcR16b.js";import"./useRouteRef-Ctloo__U.js";import"./index-CJ8jAIcI.js";import"./InfoCard-DZsmPUZT.js";import"./CardContent-BUFOZZwh.js";import"./ErrorBoundary-C0Bt02sA.js";import"./ErrorPanel-B3OsaLRR.js";import"./WarningPanel-D07MgOJm.js";import"./ExpandMore-CCqXodF2.js";import"./AccordionDetails-DWgDfIG0.js";import"./index-B9sM2jn7.js";import"./Collapse-Bi_tnvhP.js";import"./MarkdownContent-yQMqdqzq.js";import"./CodeSnippet-BkmLPXrW.js";import"./Box-BjQGvIzi.js";import"./styled-DNdG2dK3.js";import"./CopyTextButton-QsOg2zVP.js";import"./useCopyToClipboard-CoHAd7Ub.js";import"./useMountedState-B2v2il8B.js";import"./Tooltip-D0BdWwmK.js";import"./Popper-zn-2LFE5.js";import"./Portal-DjeB-iF_.js";import"./List-C-NEuts9.js";import"./ListContext-D0DH-Ku-.js";import"./ListItem-LVIqWJQW.js";import"./ListItemText-cZEZ1Dk-.js";import"./LinkButton-Tx7Iuxw9.js";import"./Link-Din0jYMc.js";import"./lodash-Czox7iJy.js";import"./Button-D7n_65H8.js";import"./CardHeader-BtsllIgw.js";import"./Divider-DmWFkQ65.js";import"./CardActions-Drgr0baR.js";import"./BottomLink-D97LEwZC.js";import"./ArrowForward-CG_5dhQW.js";import"./DialogTitle-D_BPwkq2.js";import"./Modal-CT70aByk.js";import"./Backdrop-B3-TbVKs.js";import"./useObservable-g2KqN0oS.js";import"./useIsomorphicLayoutEffect-Cf9o0_mJ.js";import"./useAsync-D295T4Y3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
