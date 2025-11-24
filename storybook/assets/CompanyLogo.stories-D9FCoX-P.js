import{j as t,T as a,c,C as g,m as l}from"./iframe-CJzL4cPn.js";import{b as i,r as d}from"./plugin-Bw2JxBRJ.js";import{S as s}from"./Grid-BQVDj5Jb.js";import{w as u}from"./appWrappers-t7jUGClR.js";import{T as f}from"./TemplateBackstageLogo-CZu6ZdNf.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-T9LhbTpw.js";import"./componentData-Bxo0opjl.js";import"./useAnalytics-BPOXrxOI.js";import"./useApp-B-72fomi.js";import"./useRouteRef-C2SQIqLl.js";import"./index-DOHES8EM.js";import"./InfoCard-s6oTMLKo.js";import"./CardContent-dYVvKObS.js";import"./ErrorBoundary-DBk-iV9m.js";import"./ErrorPanel-GfXZ_B1c.js";import"./WarningPanel-BI6WRQPV.js";import"./ExpandMore-CmjptgVe.js";import"./AccordionDetails-BotIVLWW.js";import"./index-DnL3XN75.js";import"./Collapse-DsMTKxQW.js";import"./MarkdownContent-C8HtueuI.js";import"./CodeSnippet-CXtB-eI-.js";import"./Box-Csalpl_F.js";import"./styled-f8cp2BHL.js";import"./CopyTextButton-CsNMp3PI.js";import"./useCopyToClipboard-PlMsdEl8.js";import"./useMountedState-B45YxSq3.js";import"./Tooltip-DPXqpdcr.js";import"./Popper-DeiYwaxg.js";import"./Portal-ySyRj64n.js";import"./List-BYbAdUIJ.js";import"./ListContext-BHz-Qyxa.js";import"./ListItem-KhwlQec0.js";import"./ListItemText-B_NH5e14.js";import"./LinkButton-UtNdPjxK.js";import"./Button-BDjrXKRV.js";import"./Link-bUQVVVBw.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CmXARScs.js";import"./Divider-BE8z6uet.js";import"./CardActions-DiO9K5sf.js";import"./BottomLink-BModPU04.js";import"./ArrowForward-Z4Kc94IP.js";import"./DialogTitle-CVZcsTa6.js";import"./Modal-1aP5x17K.js";import"./Backdrop-gfzpOR42.js";import"./useObservable-CavGCRyy.js";import"./useIsomorphicLayoutEffect-CudT8Pcz.js";import"./useAsync-BSNRfxTI.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
