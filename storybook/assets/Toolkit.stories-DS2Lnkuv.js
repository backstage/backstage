import{j as o}from"./iframe-DLcIH_b-.js";import{c as e}from"./plugin-0ZeJDv4r.js";import{S as l}from"./Grid-CHWXErYD.js";import{C as m}from"./ComponentAccordion-CMdB5ekj.js";import{w as a}from"./appWrappers-c50PuD_P.js";import{T as i}from"./TemplateBackstageLogoIcon-JTWFH0gF.js";import{I as s}from"./InfoCard-Dkx3ZgXO.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BWXACEjV.js";import"./componentData-C1Rjz3DB.js";import"./useAnalytics-DDULU5MS.js";import"./useApp-DqnX_mGX.js";import"./useRouteRef-D96ygvpF.js";import"./index-DTUFdyDi.js";import"./DialogTitle--QOAyxVA.js";import"./Modal-DqSKD8Sk.js";import"./Portal-D2sb6xU7.js";import"./Backdrop-DbozdCou.js";import"./Button-B2shhtfY.js";import"./useObservable-DOAzawHV.js";import"./useIsomorphicLayoutEffect-5pUHGSZD.js";import"./ExpandMore-C68SGr3c.js";import"./AccordionDetails-tL39bQia.js";import"./index-B9sM2jn7.js";import"./Collapse-BJd8DAV0.js";import"./useAsync-Dzs_Z8Sa.js";import"./useMountedState-CJM5rP6v.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-InV1eJC6.js";import"./ErrorBoundary-DMqIfELc.js";import"./ErrorPanel-DxXUdzmq.js";import"./WarningPanel-B3vPuQN4.js";import"./MarkdownContent-Cp_Yq8fi.js";import"./CodeSnippet-C1jqIUTN.js";import"./Box-DaYdGGLQ.js";import"./styled-CJB3T-Oh.js";import"./CopyTextButton-BGx5v8bI.js";import"./useCopyToClipboard-D3pZMe8I.js";import"./Tooltip-DOrjEsZ_.js";import"./Popper-BhVwcAhT.js";import"./List-DgCkyPF-.js";import"./ListContext-C-a3EO19.js";import"./ListItem-BtxOUJ8W.js";import"./ListItemText-C61nqRKy.js";import"./LinkButton-C9WhmMmo.js";import"./Link-Dc4YfHTT.js";import"./lodash-rxUtCtQt.js";import"./CardHeader-C4FrCkZC.js";import"./Divider-fjKwa6Mv.js";import"./CardActions-BrXGgoXX.js";import"./BottomLink-CUAcGApu.js";import"./ArrowForward-PHFQlPVc.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
