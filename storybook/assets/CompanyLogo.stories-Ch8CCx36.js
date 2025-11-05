import{j as t,T as a,c,C as g,m as l}from"./iframe-CjPeRtpr.js";import{b as i,r as d}from"./plugin-BFKPDosn.js";import{S as s}from"./Grid-C-Nq5_yH.js";import{w as u}from"./appWrappers-C7xvnveN.js";import{T as f}from"./TemplateBackstageLogo-wrSqeQc5.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-By9pZykQ.js";import"./componentData-BESRmA5Y.js";import"./useAnalytics-CKVjVoDQ.js";import"./useApp-BDYwb5CO.js";import"./useRouteRef-aNZDBX5J.js";import"./index-o3KEuSlS.js";import"./InfoCard-C-EjB3hx.js";import"./CardContent-CEOlXio4.js";import"./ErrorBoundary-BhQ1akLk.js";import"./ErrorPanel-By3NRS2J.js";import"./WarningPanel-qGQeTBaX.js";import"./ExpandMore-Cc9LWRDz.js";import"./AccordionDetails-DEzX30Kp.js";import"./index-DnL3XN75.js";import"./Collapse-CKqt3vm7.js";import"./MarkdownContent-B1Y4fp3A.js";import"./CodeSnippet-BmcxidKZ.js";import"./Box-Clo5S76h.js";import"./styled-HkKxam_j.js";import"./CopyTextButton-pFjOigu_.js";import"./useCopyToClipboard-Cab7YRdZ.js";import"./useMountedState-_t540rGO.js";import"./Tooltip-D2MzRiUK.js";import"./Popper-Daug_pz5.js";import"./Portal-DbRgE8W4.js";import"./List-viPECRg_.js";import"./ListContext-B6QifY9s.js";import"./ListItem-DXifIexk.js";import"./ListItemText-DslgGDwr.js";import"./LinkButton-Cj8Y8NY6.js";import"./Button-BBexx9Xc.js";import"./Link-C_RbsuLk.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-Dcsx-jhN.js";import"./Divider-CTYbgud9.js";import"./CardActions-lfCrbJSj.js";import"./BottomLink-CulmZeTU.js";import"./ArrowForward-D3dovPjI.js";import"./DialogTitle-BwKasQ9h.js";import"./Modal-CJx3g85d.js";import"./Backdrop-BucF1-y1.js";import"./useObservable-BgsOv5AO.js";import"./useIsomorphicLayoutEffect-DOJbEOhC.js";import"./useAsync-D_X77wsO.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
