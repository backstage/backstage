import{j as t,T as a,c,C as g,m as l}from"./iframe-QksS9oll.js";import{b as i,r as d}from"./plugin-cime2aoh.js";import{S as s}from"./Grid-D7XFfWKi.js";import{w as u}from"./appWrappers-Cbugcrv7.js";import{T as f}from"./TemplateBackstageLogo-Dq9p3Gpo.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-TdwU8h6j.js";import"./componentData-CRWc3Ue1.js";import"./useAnalytics-D3S6fnIb.js";import"./useApp-CB9Zi9mM.js";import"./useRouteRef-CZboVwVy.js";import"./index-esiVI4gD.js";import"./InfoCard-BwrMRdCa.js";import"./CardContent-B-_Sxb8f.js";import"./ErrorBoundary-DXuXgUlr.js";import"./ErrorPanel-_1DH6jIy.js";import"./WarningPanel-D9lI_etd.js";import"./ExpandMore-BvW0rUjO.js";import"./AccordionDetails-DsDHdK5k.js";import"./index-B9sM2jn7.js";import"./Collapse-BhNoWWNo.js";import"./MarkdownContent-D_MwY5Q0.js";import"./CodeSnippet-NS8GLkfk.js";import"./Box-4mwxRbT8.js";import"./styled-Dz3wLS-L.js";import"./CopyTextButton-CkYKd75j.js";import"./useCopyToClipboard-B1WVdUm6.js";import"./useMountedState-DqrcsGZ8.js";import"./Tooltip-DBYgA5-n.js";import"./Popper-BcJim0Sm.js";import"./Portal-DNcXKhCz.js";import"./List-BifWF3Ny.js";import"./ListContext-BPnrPY1o.js";import"./ListItem-CjzOJyc8.js";import"./ListItemText-DdfK1hjm.js";import"./LinkButton-DzZbKr17.js";import"./Button-Dfimf7ZU.js";import"./Link-vv3H9C9T.js";import"./lodash-Czox7iJy.js";import"./CardHeader-B0eVnrW4.js";import"./Divider-C2MLF46q.js";import"./CardActions-DAsWgPAr.js";import"./BottomLink-8s-33zJ-.js";import"./ArrowForward-DFKd6RHK.js";import"./DialogTitle-CMD6ovcq.js";import"./Modal-BVik2DkJ.js";import"./Backdrop-D-shBcLD.js";import"./useObservable-BEkg0zh2.js";import"./useIsomorphicLayoutEffect-DsxO7SBP.js";import"./useAsync-DdMXChPX.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
