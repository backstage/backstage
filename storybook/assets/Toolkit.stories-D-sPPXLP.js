import{j as o}from"./iframe-BNPQer77.js";import{c as e}from"./plugin-DkrmrcvX.js";import{S as l}from"./Grid-Yv5UUmOJ.js";import{C as m}from"./ComponentAccordion-CtOselvC.js";import{w as a}from"./appWrappers-DclPpZoE.js";import{T as i}from"./TemplateBackstageLogoIcon-B9gu5aIw.js";import{I as s}from"./InfoCard-DwNAFoKC.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-oKbni2qq.js";import"./componentData-CJSyf2UH.js";import"./useAnalytics-DI9G1xrU.js";import"./useApp-C940MqwE.js";import"./useRouteRef-B6URd4oF.js";import"./index-D2A2K7dC.js";import"./DialogTitle-BazRkn4Q.js";import"./Modal-DuAz145P.js";import"./Portal-D6rxE-he.js";import"./Backdrop-_FdCAelp.js";import"./Button-DSVLq8Gc.js";import"./useObservable-CdBXE0_V.js";import"./useIsomorphicLayoutEffect-Dmyd5J3v.js";import"./ExpandMore-DnsJ2ZcH.js";import"./AccordionDetails-D3zUb3eJ.js";import"./index-B9sM2jn7.js";import"./Collapse-CiSJJETO.js";import"./useAsync-D-OdF4D0.js";import"./useMountedState-Zh225SSx.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BPwlvUBu.js";import"./ErrorBoundary-Dp__O7FQ.js";import"./ErrorPanel-DtcOFy2G.js";import"./WarningPanel-BL8AsDrP.js";import"./MarkdownContent-BjXL71oS.js";import"./CodeSnippet-cVxXfk04.js";import"./Box-C3TqwX1t.js";import"./styled-T_nlQOJW.js";import"./CopyTextButton-CEvihpza.js";import"./useCopyToClipboard-w_54iq4h.js";import"./Tooltip-ZVPmh-dx.js";import"./Popper-BItIL40F.js";import"./List-Bj78s_pe.js";import"./ListContext-BZ4pbeSM.js";import"./ListItem-we3G7HGD.js";import"./ListItemText-BhKqNs_V.js";import"./LinkButton-EyIacAfh.js";import"./Link-B__iWKUx.js";import"./lodash-D6Y5cDVN.js";import"./CardHeader-iXMDg4_V.js";import"./Divider-B0I47vSC.js";import"./CardActions-z54Pz9Zl.js";import"./BottomLink-BGD6zuos.js";import"./ArrowForward-DRg3cXaR.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
