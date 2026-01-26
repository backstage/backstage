import{j as o}from"./iframe-CG856I7g.js";import{c as e}from"./plugin-BqJnaI0I.js";import{S as l}from"./Grid-CG84KQIV.js";import{C as m}from"./ComponentAccordion-BDTWn_8C.js";import{w as a}from"./appWrappers-DEP7SCZP.js";import{T as i}from"./TemplateBackstageLogoIcon-DwuFGlND.js";import{I as s}from"./InfoCard-DY4hdaxa.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D3BXoFcT.js";import"./componentData-aFf6ewzF.js";import"./useAnalytics-D5P-YjA8.js";import"./useApp-CtCgKAFa.js";import"./useRouteRef-B8PYaAAi.js";import"./index-PWNHdhKk.js";import"./DialogTitle-BYAFwPKR.js";import"./Modal-odp3IgY3.js";import"./Portal-Bhu3uB1L.js";import"./Backdrop-DWQDC5UU.js";import"./Button-os8mT4aD.js";import"./useObservable-CZ-R5m23.js";import"./useIsomorphicLayoutEffect-BmiTUf2k.js";import"./ExpandMore-DTKTum2k.js";import"./AccordionDetails-CmfQvp7G.js";import"./index-B9sM2jn7.js";import"./Collapse-vpACe9Y2.js";import"./useAsync-CdIFnDD6.js";import"./useMountedState-Bvsb1ptg.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BwT5h854.js";import"./ErrorBoundary-BK2MlTdY.js";import"./ErrorPanel-DZ1ApYdQ.js";import"./WarningPanel-CDDj3MLB.js";import"./MarkdownContent-BwSLPwTP.js";import"./CodeSnippet-CUezJ-Mg.js";import"./Box-DirFOCIJ.js";import"./styled-8AOit3ty.js";import"./CopyTextButton-B_1HfWK0.js";import"./useCopyToClipboard-CUxcez1F.js";import"./Tooltip-DTkgI76M.js";import"./Popper-BTDu7j3q.js";import"./List-BTwiC7G-.js";import"./ListContext-BzsI-cEV.js";import"./ListItem-BWUkcOJl.js";import"./ListItemText-QtFV-4wl.js";import"./LinkButton-B6IB7a9D.js";import"./Link-Cd9n886D.js";import"./lodash-Czox7iJy.js";import"./CardHeader-BjVEl-5E.js";import"./Divider-gH4LD_Ra.js";import"./CardActions-CxPYtsdJ.js";import"./BottomLink-DB2Nr5nG.js";import"./ArrowForward-ClGRA-Ks.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
