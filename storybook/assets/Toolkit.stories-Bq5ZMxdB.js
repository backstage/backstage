import{j as o}from"./iframe-Yl0Qc67S.js";import{c as e}from"./plugin-BkwveSeS.js";import{S as l}from"./Grid-BoLsaJTc.js";import{C as m}from"./ComponentAccordion-DSRPFiN4.js";import{w as a}from"./appWrappers-CnXqdPEu.js";import{T as i}from"./TemplateBackstageLogoIcon-CsBMPFSE.js";import{I as s}from"./InfoCard-CXsxUKdX.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Beh3pv9A.js";import"./componentData-D8eoWRR-.js";import"./useAnalytics-De1GIX-U.js";import"./useApp-5HecZ9VC.js";import"./useRouteRef-DxCJ4QuA.js";import"./index-CuRibKaG.js";import"./DialogTitle-DbBdv3gV.js";import"./Modal-iRV6ko-2.js";import"./Portal-kuGKvNyC.js";import"./Backdrop-DutGXUrc.js";import"./Button-bP0crEE2.js";import"./useObservable-DO3JHHHA.js";import"./useIsomorphicLayoutEffect-BgwaU1Zu.js";import"./ExpandMore-DlTYCfZc.js";import"./AccordionDetails-UWNICwr0.js";import"./index-B9sM2jn7.js";import"./Collapse-CReMq_1Z.js";import"./useAsync-HjbYn2WS.js";import"./useMountedState-B1Psi6MC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-U26WTHFS.js";import"./ErrorBoundary-CgJuMyhL.js";import"./ErrorPanel-DLd7jlxf.js";import"./WarningPanel-DPnP4zkP.js";import"./MarkdownContent-DmHmkZd9.js";import"./CodeSnippet-B108T10t.js";import"./Box-DltD7D0m.js";import"./styled-DXbACUbA.js";import"./CopyTextButton-3gQ_70GM.js";import"./useCopyToClipboard-BnQ5eYWr.js";import"./Tooltip-N5ZLqhtT.js";import"./Popper-90U13irg.js";import"./List-C5jB0ILm.js";import"./ListContext-BQmyr3YY.js";import"./ListItem-BafF8VBM.js";import"./ListItemText-9ikpSF0R.js";import"./LinkButton-BzDiNx0m.js";import"./Link-_9kMa81h.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-DuvnTHjz.js";import"./Divider-DRYu6qgR.js";import"./CardActions-DtARUctM.js";import"./BottomLink-Ca2TP61T.js";import"./ArrowForward-BkzBO0po.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
