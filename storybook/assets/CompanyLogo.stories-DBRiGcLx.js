import{j as t,T as a,c,C as g,m as l}from"./iframe-BkB0QVAX.js";import{b as i,r as d}from"./plugin-DI1j4xAJ.js";import{S as s}from"./Grid-GzVmgdg9.js";import{w as u}from"./appWrappers-BeDZegEM.js";import{T as f}from"./TemplateBackstageLogo-D69jtZTo.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BB1nd9si.js";import"./componentData-BqyKlC7z.js";import"./useAnalytics-BaiO7IUZ.js";import"./useApp-BcKqXm1b.js";import"./useRouteRef-D7AJ89qx.js";import"./index-CG9-iTWl.js";import"./InfoCard-vDgIcNkq.js";import"./CardContent-C9KAu5n0.js";import"./ErrorBoundary-CG99R0aj.js";import"./ErrorPanel-33EFS4fI.js";import"./WarningPanel-C4fTNgaU.js";import"./ExpandMore-BpFbETJI.js";import"./AccordionDetails-BPj0HgKP.js";import"./index-DnL3XN75.js";import"./Collapse-CFXKULw1.js";import"./MarkdownContent-C_11qXRU.js";import"./CodeSnippet-928r43_H.js";import"./Box-BYh2ueao.js";import"./styled-BkGenL9r.js";import"./CopyTextButton-SuTXHCNw.js";import"./useCopyToClipboard-ybsekL_1.js";import"./useMountedState-pzVPha7m.js";import"./Tooltip-Cw7U8Fon.js";import"./Popper-CoIZ3FWg.js";import"./Portal-CniYJQFb.js";import"./List-CL3RsQbd.js";import"./ListContext-1D3zRM57.js";import"./ListItem-uoYhpxef.js";import"./ListItemText-ClLUctdJ.js";import"./LinkButton-Dk1fxXeJ.js";import"./Button-VsEN5bia.js";import"./Link-DEl3EO73.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CjkICost.js";import"./Divider-BE4Qblaw.js";import"./CardActions-C5dkW2n_.js";import"./BottomLink-kRokVK0c.js";import"./ArrowForward-BeJ_-l-J.js";import"./DialogTitle-BDGKjWc8.js";import"./Modal-BGWqml8P.js";import"./Backdrop-V6ewlv6k.js";import"./useObservable-ix0ZtonL.js";import"./useAsync-xBHTNlYp.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const fo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const yo=["Default","CustomLogo"];export{e as CustomLogo,r as Default,yo as __namedExportsOrder,fo as default};
