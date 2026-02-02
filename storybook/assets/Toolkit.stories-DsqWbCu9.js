import{j as o}from"./iframe-DG9KPDCv.js";import{c as e}from"./plugin-BZMPV-Oi.js";import{S as l}from"./Grid-BalTlFvh.js";import{C as m}from"./ComponentAccordion-DO6hwXVW.js";import{w as a}from"./appWrappers-kZwlpPuG.js";import{T as i}from"./TemplateBackstageLogoIcon-goqEvyUv.js";import{I as s}from"./InfoCard-DO5i_j0E.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CiKdo3lK.js";import"./componentData-VtzvnnGf.js";import"./useAnalytics-DskDDOhn.js";import"./useApp-ijvxHEa-.js";import"./useRouteRef-CjX1VRTP.js";import"./index-Bi0fcTw3.js";import"./DialogTitle-DOFx0Hy9.js";import"./Modal-BgaFEzC9.js";import"./Portal-Du_aJAA6.js";import"./Backdrop-BPZGx_ZF.js";import"./Button-B0fitv1X.js";import"./useObservable-Bi2yOTki.js";import"./useIsomorphicLayoutEffect-C3SuLUwq.js";import"./ExpandMore-CqQxAXKH.js";import"./AccordionDetails-BMa1mXpE.js";import"./index-B9sM2jn7.js";import"./Collapse-B-7etz-P.js";import"./useAsync-BV2n2o7b.js";import"./useMountedState-B6hIrLCn.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BGfCwbYU.js";import"./ErrorBoundary-D71e96bV.js";import"./ErrorPanel-CIVa9hyi.js";import"./WarningPanel-Ttu6_E0y.js";import"./MarkdownContent-CFcdNsXY.js";import"./CodeSnippet-Bw31BDNG.js";import"./Box-CpNeY0Xu.js";import"./styled-B_dsPLrg.js";import"./CopyTextButton-CBgD5fD0.js";import"./useCopyToClipboard-_Xorwdaf.js";import"./Tooltip-DkJtZmcZ.js";import"./Popper-BuiKgC9z.js";import"./List-DESWnqW5.js";import"./ListContext-Cqq2xDze.js";import"./ListItem-CdFlW9lK.js";import"./ListItemText-W0WQZlCP.js";import"./LinkButton-C2E1-Jxu.js";import"./Link-BeOk29Gb.js";import"./lodash-Czox7iJy.js";import"./CardHeader-DY4wzGjS.js";import"./Divider-e6kSnJJ8.js";import"./CardActions-BmSxOddO.js";import"./BottomLink-7FBGOaZa.js";import"./ArrowForward-CggHymR0.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
