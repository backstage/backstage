import{j as t,U as a,V as c,W as g,m as l}from"./iframe-BNPQer77.js";import{b as i,r as d}from"./plugin-DkrmrcvX.js";import{S as s}from"./Grid-Yv5UUmOJ.js";import{w as u}from"./appWrappers-DclPpZoE.js";import{T as f}from"./TemplateBackstageLogo-CQz63Q2d.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-oKbni2qq.js";import"./componentData-CJSyf2UH.js";import"./useAnalytics-DI9G1xrU.js";import"./useApp-C940MqwE.js";import"./useRouteRef-B6URd4oF.js";import"./index-D2A2K7dC.js";import"./InfoCard-DwNAFoKC.js";import"./CardContent-BPwlvUBu.js";import"./ErrorBoundary-Dp__O7FQ.js";import"./ErrorPanel-DtcOFy2G.js";import"./WarningPanel-BL8AsDrP.js";import"./ExpandMore-DnsJ2ZcH.js";import"./AccordionDetails-D3zUb3eJ.js";import"./index-B9sM2jn7.js";import"./Collapse-CiSJJETO.js";import"./MarkdownContent-BjXL71oS.js";import"./CodeSnippet-cVxXfk04.js";import"./Box-C3TqwX1t.js";import"./styled-T_nlQOJW.js";import"./CopyTextButton-CEvihpza.js";import"./useCopyToClipboard-w_54iq4h.js";import"./useMountedState-Zh225SSx.js";import"./Tooltip-ZVPmh-dx.js";import"./Popper-BItIL40F.js";import"./Portal-D6rxE-he.js";import"./List-Bj78s_pe.js";import"./ListContext-BZ4pbeSM.js";import"./ListItem-we3G7HGD.js";import"./ListItemText-BhKqNs_V.js";import"./LinkButton-EyIacAfh.js";import"./Link-B__iWKUx.js";import"./lodash-D6Y5cDVN.js";import"./Button-DSVLq8Gc.js";import"./CardHeader-iXMDg4_V.js";import"./Divider-B0I47vSC.js";import"./CardActions-z54Pz9Zl.js";import"./BottomLink-BGD6zuos.js";import"./ArrowForward-DRg3cXaR.js";import"./DialogTitle-BazRkn4Q.js";import"./Modal-DuAz145P.js";import"./Backdrop-_FdCAelp.js";import"./useObservable-CdBXE0_V.js";import"./useIsomorphicLayoutEffect-Dmyd5J3v.js";import"./useAsync-D-OdF4D0.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
