import{j as t,T as a,c,C as g,m as l}from"./iframe-B6vHPHUS.js";import{b as i,r as d}from"./plugin-Cr81OckD.js";import{S as s}from"./Grid-BHnfM9BN.js";import{w as u}from"./appWrappers-m0dyImYt.js";import{T as f}from"./TemplateBackstageLogo-C5Pm3gIA.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-uDhfna-s.js";import"./componentData-Ck-liOWv.js";import"./useAnalytics-CHRs9F0l.js";import"./useApp-c9Cmx9JK.js";import"./useRouteRef-_QxqMNzn.js";import"./index-CG8HQpK_.js";import"./InfoCard-Dl82Ld7M.js";import"./CardContent-DSCKd1_n.js";import"./ErrorBoundary-Crn6Mezf.js";import"./ErrorPanel-B64V3zAe.js";import"./WarningPanel-C9caxC0h.js";import"./ExpandMore-B0SFV6c5.js";import"./AccordionDetails-B-VwfNtv.js";import"./index-DnL3XN75.js";import"./Collapse-CIMX6SDT.js";import"./MarkdownContent-D1AHxM79.js";import"./CodeSnippet-CV4g9JLu.js";import"./Box-BsuLuKk6.js";import"./styled-BNzka1pC.js";import"./CopyTextButton-DuiMHNoR.js";import"./useCopyToClipboard-DyRiVU--.js";import"./useMountedState-4spEAOpb.js";import"./Tooltip-BKT0sHqR.js";import"./Popper-0ce0RW6i.js";import"./Portal-DQJrkvBY.js";import"./List-C19QDRq1.js";import"./ListContext-D8DpMZfT.js";import"./ListItem-BxDrZyrD.js";import"./ListItemText-BE9Uflaf.js";import"./LinkButton-DwUDlPmx.js";import"./Button-CJpRzj7y.js";import"./Link-BCwjV0MZ.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-YOBkbVrI.js";import"./Divider-PYX69q2N.js";import"./CardActions-C0mZmhjb.js";import"./BottomLink-CNa6Jzbq.js";import"./ArrowForward-B1fZSS8q.js";import"./DialogTitle-B91uUjY7.js";import"./Modal-BadxeSQ1.js";import"./Backdrop-khO5dm31.js";import"./useObservable-Cj9WRojc.js";import"./useIsomorphicLayoutEffect-CWw7s17H.js";import"./useAsync-CtKW-R0u.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
