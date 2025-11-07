import{j as t,T as a,c,C as g,m as l}from"./iframe-C4yti0TH.js";import{b as i,r as d}from"./plugin-DzdQwfcL.js";import{S as s}from"./Grid-v0xxfd_1.js";import{w as u}from"./appWrappers-CHKMDW6u.js";import{T as f}from"./TemplateBackstageLogo-flWOYf0w.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-IDIj0Vlw.js";import"./componentData-CnWfJ3h2.js";import"./useAnalytics--K1VOgoc.js";import"./useApp-y9Jc7IOk.js";import"./useRouteRef-HPBHqWqn.js";import"./index-B-o6asHV.js";import"./InfoCard-DPJdH_Et.js";import"./CardContent-Bf4mW7o7.js";import"./ErrorBoundary-BzulBN0z.js";import"./ErrorPanel-EUwm2tRb.js";import"./WarningPanel-f4sgKJ3Y.js";import"./ExpandMore-C2bx2cGu.js";import"./AccordionDetails-DTv3HEFi.js";import"./index-DnL3XN75.js";import"./Collapse-BxjtCAeZ.js";import"./MarkdownContent-Dh73zjai.js";import"./CodeSnippet-C8zNOjQI.js";import"./Box-a1543Axe.js";import"./styled-DNUHEHW0.js";import"./CopyTextButton-CW3FaXzD.js";import"./useCopyToClipboard-CdfTyMvr.js";import"./useMountedState-Cru6FRlT.js";import"./Tooltip-BSjhen_5.js";import"./Popper-BlfRkzWo.js";import"./Portal-JPlxc26l.js";import"./List-BRXiU0XK.js";import"./ListContext-BOYwBhLf.js";import"./ListItem-Cb_9Twd1.js";import"./ListItemText-BWf0pAiq.js";import"./LinkButton-C9QcjCSf.js";import"./Button-CYNcmEzy.js";import"./Link-Cz9gaJJo.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CjUFrut6.js";import"./Divider-CU5IM_SK.js";import"./CardActions-ClCDbtfI.js";import"./BottomLink-Ds2ntytz.js";import"./ArrowForward-JohorMon.js";import"./DialogTitle-N20emC9L.js";import"./Modal-Bq63ThXv.js";import"./Backdrop-CvNyeuNu.js";import"./useObservable-arzc73Pi.js";import"./useIsomorphicLayoutEffect-CzIfcLC5.js";import"./useAsync-D8arkYRP.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
