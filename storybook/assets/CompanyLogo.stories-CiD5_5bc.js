import{j as t,U as a,V as c,W as g,m as l}from"./iframe-BDvXWqMv.js";import{b as i,r as d}from"./plugin-Z2ZPAbRk.js";import{S as s}from"./Grid-SEE3Vji4.js";import{w as u}from"./appWrappers-D7GkfUM0.js";import{T as f}from"./TemplateBackstageLogo-2IXvXge2.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-6Gt6crr0.js";import"./componentData-8WYIPpYM.js";import"./useAnalytics-Bhj43Yb4.js";import"./useApp-XW1Y_59p.js";import"./useRouteRef-BNT0Uji7.js";import"./index-CuoyrUh2.js";import"./InfoCard-DuIbSHrf.js";import"./CardContent-ByGsH1mf.js";import"./ErrorBoundary-Cmwdx4oo.js";import"./ErrorPanel-DIJrYilU.js";import"./WarningPanel-B6FaAcan.js";import"./ExpandMore-D0gsRd1g.js";import"./AccordionDetails-Dl8lH0s0.js";import"./index-B9sM2jn7.js";import"./Collapse-CyX3uF1t.js";import"./MarkdownContent-CH9QtLal.js";import"./CodeSnippet-CRyXuPAV.js";import"./Box-BU77o5ge.js";import"./styled-Dje9scF9.js";import"./CopyTextButton-Bw_MRs6O.js";import"./useCopyToClipboard-CKArlyoH.js";import"./useMountedState-DRPCbnV1.js";import"./Tooltip-La5U8gro.js";import"./Popper-CBqxIWf4.js";import"./Portal-Bxsqc2Ff.js";import"./List-BCScUoZK.js";import"./ListContext-BMD4k7rh.js";import"./ListItem-DtJ6NXng.js";import"./ListItemText-BChUSAmp.js";import"./LinkButton-CGPFeLQh.js";import"./Link-OHorDb2O.js";import"./lodash-DTh7qDqK.js";import"./Button-D_oOYcjF.js";import"./CardHeader-D5WvCsB_.js";import"./Divider-BVTElTLB.js";import"./CardActions-BCLarAT5.js";import"./BottomLink-CnwY1COn.js";import"./ArrowForward-B0ytsCDP.js";import"./DialogTitle-DbfnWxYL.js";import"./Modal-aUjOD6G2.js";import"./Backdrop-DQKzqBN9.js";import"./useObservable-C5WBInFh.js";import"./useIsomorphicLayoutEffect-Ckaa7XZb.js";import"./useAsync-CZTayVe5.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
