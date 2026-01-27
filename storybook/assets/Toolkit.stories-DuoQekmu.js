import{j as o}from"./iframe-C1ohgxPY.js";import{c as e}from"./plugin-DEyj1dW0.js";import{S as l}from"./Grid-ClUEh4fm.js";import{C as m}from"./ComponentAccordion-CZIhyvHC.js";import{w as a}from"./appWrappers-53W6Z_Fl.js";import{T as i}from"./TemplateBackstageLogoIcon-HWLMjl3N.js";import{I as s}from"./InfoCard-BI6fiYg-.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-cKXSvaFH.js";import"./componentData-CLq0rdgK.js";import"./useAnalytics-CjWTFi6W.js";import"./useApp-J6Z3sWBa.js";import"./useRouteRef-ayjdeWHT.js";import"./index-pzwzu_48.js";import"./DialogTitle-DrsqXQow.js";import"./Modal-EWqQvSRV.js";import"./Portal-CA7fRi5Y.js";import"./Backdrop-D03isVae.js";import"./Button-aR7p6seP.js";import"./useObservable-CezIJmdx.js";import"./useIsomorphicLayoutEffect-C8m3vn51.js";import"./ExpandMore-BahcoyIm.js";import"./AccordionDetails-Ci8EIrXK.js";import"./index-B9sM2jn7.js";import"./Collapse-BVJkjsmV.js";import"./useAsync-TxDBlLIm.js";import"./useMountedState-m4mlNTW7.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-QS0yr0Ka.js";import"./ErrorBoundary-DUAUzTN6.js";import"./ErrorPanel-Cu206NQf.js";import"./WarningPanel-Cqk4HdYp.js";import"./MarkdownContent-CG5N0PWp.js";import"./CodeSnippet-CdNwSyzj.js";import"./Box-B9XEklXr.js";import"./styled-DiQntVKI.js";import"./CopyTextButton-Cqy0wuG-.js";import"./useCopyToClipboard-ByZDolH4.js";import"./Tooltip-Dpj1LhZh.js";import"./Popper-BcbGe3J0.js";import"./List-BRbAiMJU.js";import"./ListContext-Ds-TBdUQ.js";import"./ListItem-Ck2-kEA7.js";import"./ListItemText-Bu4Q5VY7.js";import"./LinkButton-C8n9_7UA.js";import"./Link-DLDptLAM.js";import"./lodash-Czox7iJy.js";import"./CardHeader-B400OvSW.js";import"./Divider-D8U2y_Q5.js";import"./CardActions-B2UPjdQO.js";import"./BottomLink-Bwy_Zoku.js";import"./ArrowForward-DrZLn-s7.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
