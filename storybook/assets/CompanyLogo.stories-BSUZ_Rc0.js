import{j as t,U as a,V as c,W as g,m as l}from"./iframe-BRAtl1PG.js";import{b as i,r as d}from"./plugin-l6zBNSAL.js";import{S as s}from"./Grid-Cneg6dXd.js";import{w as u}from"./appWrappers-B2HzzFzx.js";import{T as f}from"./TemplateBackstageLogo-BV7nAmmi.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-B8o3244Q.js";import"./componentData-jPNeQwLn.js";import"./useAnalytics-DVsybmfh.js";import"./useApp-Gv1SYk8q.js";import"./useRouteRef-D86Ud85d.js";import"./index-UAXk7FN5.js";import"./InfoCard-Usjt7j2Q.js";import"./CardContent-0Gy7iGeb.js";import"./ErrorBoundary-BxBSIGMP.js";import"./ErrorPanel-YK6XTPJI.js";import"./WarningPanel-Dgi0x69_.js";import"./ExpandMore-DRdYJoQu.js";import"./AccordionDetails-DIaxBLag.js";import"./index-B9sM2jn7.js";import"./Collapse-_zQA2_Pp.js";import"./MarkdownContent-BIfRKm7t.js";import"./CodeSnippet-BYUXS9v0.js";import"./Box-D7EfII4J.js";import"./styled-D-CRs93U.js";import"./CopyTextButton-BPfRPWdE.js";import"./useCopyToClipboard-BuklA7P5.js";import"./useMountedState-PBRhdOpD.js";import"./Tooltip-CPq4vOtC.js";import"./Popper-b-3H8dnH.js";import"./Portal-CmmcMNPo.js";import"./List-DW5i0QCT.js";import"./ListContext-DnBkigGS.js";import"./ListItem-DGTqNMMt.js";import"./ListItemText-BSrDcH8Z.js";import"./LinkButton-B0gUiM7k.js";import"./Link-BXsEZtUH.js";import"./lodash-Czox7iJy.js";import"./Button-BatWjXLp.js";import"./CardHeader-SetS9v0o.js";import"./Divider-BFDiZlO8.js";import"./CardActions-CvfK4yuw.js";import"./BottomLink-B6cNqluB.js";import"./ArrowForward-Cbg0slKz.js";import"./DialogTitle-KC0EWpd-.js";import"./Modal-COPte8PF.js";import"./Backdrop-B3YqXUgb.js";import"./useObservable-DhHSl2gB.js";import"./useIsomorphicLayoutEffect-DAhw2EJx.js";import"./useAsync-ldnaQaod.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
