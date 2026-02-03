import{j as t,U as a,V as c,W as g,m as l}from"./iframe-DCoYcZLi.js";import{b as i,r as d}from"./plugin-Cy-L2iFb.js";import{S as s}from"./Grid-D58TNpxw.js";import{w as u}from"./appWrappers-bScNmkAy.js";import{T as f}from"./TemplateBackstageLogo-CjTYuzDn.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CPv3ynDX.js";import"./componentData-OraWGl32.js";import"./useAnalytics-DTSsXZrs.js";import"./useApp-B6U5E67n.js";import"./useRouteRef-D7QjhLBn.js";import"./index-CZ9gZJRb.js";import"./InfoCard-jQMy2gNa.js";import"./CardContent-BVxN23xK.js";import"./ErrorBoundary-CrlGkNeT.js";import"./ErrorPanel-D9pajOJW.js";import"./WarningPanel-2R8Y_I4d.js";import"./ExpandMore-BjerwzBY.js";import"./AccordionDetails-D0-Ip2Ry.js";import"./index-B9sM2jn7.js";import"./Collapse-K2usbj1G.js";import"./MarkdownContent-B24-9cF1.js";import"./CodeSnippet-BoQ2ohjZ.js";import"./Box-DX2D8BTJ.js";import"./styled-h2gldWYB.js";import"./CopyTextButton-Crh7sKVk.js";import"./useCopyToClipboard-Ceo0QToL.js";import"./useMountedState-CnGoVtA3.js";import"./Tooltip-B4Ob7Xca.js";import"./Popper-DRIxTtO6.js";import"./Portal-CFcI6CIt.js";import"./List-BdybXaA2.js";import"./ListContext-DkVKA3j4.js";import"./ListItem-DlFYWpXw.js";import"./ListItemText-BwT95NDX.js";import"./LinkButton-DC4rMSam.js";import"./Link-BB_0S9nF.js";import"./lodash-Czox7iJy.js";import"./Button-Cp5oCkaD.js";import"./CardHeader-B32gDeY8.js";import"./Divider-Ca-0TjsJ.js";import"./CardActions-BhlKSozU.js";import"./BottomLink-DKSFJeM5.js";import"./ArrowForward-BR9xJcBP.js";import"./DialogTitle-CfF7TlGp.js";import"./Modal-CPACyKe7.js";import"./Backdrop-BzZC6sIJ.js";import"./useObservable-CYrlA7wL.js";import"./useIsomorphicLayoutEffect-ByWXU8SB.js";import"./useAsync-BaVFaK6n.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
