import{j as t,T as a,c,C as g,m as l}from"./iframe-BpNetfkk.js";import{b as i,r as d}from"./plugin-DBnmytZR.js";import{S as s}from"./Grid-DGDU_W7d.js";import{w as u}from"./appWrappers-BOa7ROWw.js";import{T as f}from"./TemplateBackstageLogo-BH-Ux8vf.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-C7nO-Ahz.js";import"./componentData-DzI36JOr.js";import"./useAnalytics-BKPjjI-y.js";import"./useApp-BAlbHaS5.js";import"./useRouteRef-xryfITRq.js";import"./index-DgvPNMU4.js";import"./InfoCard-B2lpfx9C.js";import"./CardContent-B2DNk4YF.js";import"./ErrorBoundary-x8IJumU0.js";import"./ErrorPanel-C-auWv_U.js";import"./WarningPanel-BZPI4iuJ.js";import"./ExpandMore-Dg48zgbf.js";import"./AccordionDetails-CXV1bjLg.js";import"./index-DnL3XN75.js";import"./Collapse-CFskqauo.js";import"./MarkdownContent-lOphwaGa.js";import"./CodeSnippet-BiIQ6QnU.js";import"./Box-JPQ-K-XF.js";import"./styled-BVnjfZaP.js";import"./CopyTextButton-D74HsvCl.js";import"./useCopyToClipboard-B1BfXZ6A.js";import"./useMountedState-ya7tp212.js";import"./Tooltip-DuxoX6f6.js";import"./Popper-Bfi8Jp6K.js";import"./Portal-D3MaVJdo.js";import"./List-CcdBBh0x.js";import"./ListContext-BkpiPoXc.js";import"./ListItem-BE6uqYrF.js";import"./ListItemText-7Fv6oNRR.js";import"./LinkButton-CzXWMwoD.js";import"./Button-D2OH5WH0.js";import"./Link-Bbtl6_jS.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-BzLrPpse.js";import"./Divider-2QoBmfwj.js";import"./CardActions-B_KvZC1G.js";import"./BottomLink-xNQE9YQZ.js";import"./ArrowForward-DwUrP4PQ.js";import"./DialogTitle-E_A2_fbu.js";import"./Modal-CJXuzFvx.js";import"./Backdrop-DCl54FLG.js";import"./useObservable-DGWPdt_D.js";import"./useIsomorphicLayoutEffect-CWGQpdG-.js";import"./useAsync-BEoRug7E.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
