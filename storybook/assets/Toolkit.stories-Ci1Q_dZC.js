import{j as o}from"./iframe-CqNqnb74.js";import{c as e}from"./plugin-Xa30wQur.js";import{S as l}from"./Grid-Caq84KkR.js";import{C as m}from"./ComponentAccordion-BcP5uLjY.js";import{w as a}from"./appWrappers-C_psOORT.js";import{T as i}from"./TemplateBackstageLogoIcon-apxC7KZE.js";import{I as s}from"./InfoCard-CG5avwIW.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-DYku7kmG.js";import"./componentData-FAAyaxJE.js";import"./useAnalytics-BT9M_UlL.js";import"./useApp-IKd96EAr.js";import"./useRouteRef-C3TAPCF-.js";import"./index-CfXjUdjY.js";import"./DialogTitle-CooOy-k1.js";import"./Modal-DG_DwVZd.js";import"./Portal-Czxz0PR0.js";import"./Backdrop-Bu5rdiX9.js";import"./Button-BIN6mxNu.js";import"./useObservable-BIXBQOil.js";import"./useIsomorphicLayoutEffect-BPmaJ8UY.js";import"./ExpandMore-CaaJdVfs.js";import"./AccordionDetails-DNjlLobr.js";import"./index-B9sM2jn7.js";import"./Collapse-D1DbSfAq.js";import"./useAsync-BA3GFE0D.js";import"./useMountedState-DTFeLOhk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Dm5YK7Lf.js";import"./ErrorBoundary-BxcDMcm2.js";import"./ErrorPanel-BYm0Mdkb.js";import"./WarningPanel-BCw9VL3x.js";import"./MarkdownContent-CAUU14sj.js";import"./CodeSnippet-DP3MYkIR.js";import"./Box-BOvD5Bg7.js";import"./styled-_PBYdDbi.js";import"./CopyTextButton-DzB5MTRG.js";import"./useCopyToClipboard-D6T0fjGN.js";import"./Tooltip-DFfl-fad.js";import"./Popper-C4CcENfH.js";import"./List-aEU9IVP1.js";import"./ListContext-D4KOPpIf.js";import"./ListItem-CO20Ch0Y.js";import"./ListItemText-qCutXsPN.js";import"./LinkButton-FESOt-od.js";import"./Link-CAxa2nmx.js";import"./lodash-Czox7iJy.js";import"./CardHeader-CmAP5YfK.js";import"./Divider-zsbty3yZ.js";import"./CardActions-CAm3b56u.js";import"./BottomLink-7YaXAONt.js";import"./ArrowForward-PIPGF8mw.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
