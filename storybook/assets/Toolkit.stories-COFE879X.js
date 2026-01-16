import{j as o}from"./iframe-XFwexWAC.js";import{c as e}from"./plugin-DmfJPYc3.js";import{S as l}from"./Grid-QGplJCTn.js";import{C as m}from"./ComponentAccordion-DHcar4Vk.js";import{w as a}from"./appWrappers-70i-hxtl.js";import{T as i}from"./TemplateBackstageLogoIcon-DjvNYZct.js";import{I as s}from"./InfoCard-C3e3GLYI.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-DRnkdvxE.js";import"./componentData-BgE2FK5U.js";import"./useAnalytics-BpI3YstQ.js";import"./useApp-D2Je31QU.js";import"./useRouteRef-B_kQk1xP.js";import"./index-BjVSwF8u.js";import"./DialogTitle-DjDrvKqf.js";import"./Modal-BKS56bVv.js";import"./Portal-DGqwvRCH.js";import"./Backdrop-BSizeznv.js";import"./Button-CfP9f6s1.js";import"./useObservable-BHUrIwGk.js";import"./useIsomorphicLayoutEffect-rnOglJxN.js";import"./ExpandMore-DmZgnz1E.js";import"./AccordionDetails-vmXM40VX.js";import"./index-B9sM2jn7.js";import"./Collapse-BtERTKf9.js";import"./useAsync-CTNfJ6Gv.js";import"./useMountedState-D8mLU74K.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DD931SVo.js";import"./ErrorBoundary-BfsUlOJh.js";import"./ErrorPanel-0ntfFJ4u.js";import"./WarningPanel-CWtEeF6X.js";import"./MarkdownContent-DGJWTS_J.js";import"./CodeSnippet-B745YxT9.js";import"./Box-DOcmf_lA.js";import"./styled-CDWDroQT.js";import"./CopyTextButton-BU9NUfM0.js";import"./useCopyToClipboard-BxYbXeOS.js";import"./Tooltip-pAeb8IBW.js";import"./Popper-Cpjma44V.js";import"./List-cHbFQZE_.js";import"./ListContext-B0O1h7iD.js";import"./ListItem-BEnPhwl_.js";import"./ListItemText-DimjlXkG.js";import"./LinkButton-GCBw9_0G.js";import"./Link-YMEncvsI.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-DuQKXcju.js";import"./Divider-AcqAP6v2.js";import"./CardActions-DaFtt8Y8.js";import"./BottomLink-DY3jThaC.js";import"./ArrowForward-lqL8v-HC.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
