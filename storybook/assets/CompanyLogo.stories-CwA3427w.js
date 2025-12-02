import{j as t,T as a,c,C as g,m as l}from"./iframe-C773ayyW.js";import{b as i,r as d}from"./plugin-gEzBmSkr.js";import{S as s}from"./Grid-oO_1iSro.js";import{w as u}from"./appWrappers-DrF6lruE.js";import{T as f}from"./TemplateBackstageLogo-OZ6NC9oH.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DgheCK0L.js";import"./componentData-Bdgmno7t.js";import"./useAnalytics-BUXUfjUP.js";import"./useApp-p5rHYLk0.js";import"./useRouteRef-BO68tLin.js";import"./index-B7-NdQX-.js";import"./InfoCard-DpchVZYW.js";import"./CardContent-0uyrcITt.js";import"./ErrorBoundary-84N5Onnv.js";import"./ErrorPanel-DHXJzEMk.js";import"./WarningPanel-CSA5ach2.js";import"./ExpandMore-Dc64qUSO.js";import"./AccordionDetails-CDPX87gH.js";import"./index-DnL3XN75.js";import"./Collapse-CHxej2af.js";import"./MarkdownContent-ebJNHJdy.js";import"./CodeSnippet-C_E6kwNC.js";import"./Box-c_uSXZkq.js";import"./styled-EjF9N2BZ.js";import"./CopyTextButton-DKZ84MGL.js";import"./useCopyToClipboard-CtMXT3me.js";import"./useMountedState-BaRlQShP.js";import"./Tooltip-BuBe4fE-.js";import"./Popper-C-ZRE_0u.js";import"./Portal-CQJvHB_7.js";import"./List-BAYQ25-v.js";import"./ListContext-BwXeXg0F.js";import"./ListItem-ByJ_H4o2.js";import"./ListItemText-DjaDs-4M.js";import"./LinkButton-BhVCLyOG.js";import"./Button-gX2CQaIh.js";import"./Link-88zF7xCS.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-BR9PWCtj.js";import"./Divider-DsftiJpK.js";import"./CardActions-BW9rpFHQ.js";import"./BottomLink-C-ywMqKi.js";import"./ArrowForward-DJtOLu8h.js";import"./DialogTitle-C7AhKUgT.js";import"./Modal-t1QUaF78.js";import"./Backdrop-CZK56ZrR.js";import"./useObservable-BD2eLMSd.js";import"./useIsomorphicLayoutEffect-fSTRkWZD.js";import"./useAsync-Dnv3cfj8.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
