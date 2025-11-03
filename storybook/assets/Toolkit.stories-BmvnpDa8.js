import{j as o}from"./iframe-B1bS8kNu.js";import{c as e}from"./plugin-9321bBmh.js";import{S as l}from"./Grid-C88sFnNl.js";import{C as m}from"./ComponentAccordion-CzqFtW9v.js";import{w as a}from"./appWrappers-C65DRcJR.js";import{T as i}from"./TemplateBackstageLogoIcon-07ASqEfJ.js";import{I as s}from"./InfoCard-DaVqc602.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-D0zUNDSW.js";import"./componentData-C-kspxhs.js";import"./useAnalytics-CWJQ4paP.js";import"./useApp-DrlXjDDm.js";import"./useRouteRef-DHlcXK6F.js";import"./index-BB5XVHud.js";import"./DialogTitle-CGSxheNa.js";import"./Modal-DljuX6iF.js";import"./Portal-CbatMowK.js";import"./Backdrop-DC3_0QFG.js";import"./Button-CgBkAUiP.js";import"./useObservable-BdE9m8Kk.js";import"./useIsomorphicLayoutEffect-B8jAT4vp.js";import"./ExpandMore-Y-_AusZ_.js";import"./AccordionDetails-DjOY9uzz.js";import"./index-DnL3XN75.js";import"./Collapse-BL8sH0TP.js";import"./useAsync-DRwN7CqQ.js";import"./useMountedState-DehZQ_NE.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-C2gGqaJ1.js";import"./ErrorBoundary-Dg6qw5Z9.js";import"./ErrorPanel-DfQRlabN.js";import"./WarningPanel-Cb2ULWmf.js";import"./MarkdownContent-B5j69JDg.js";import"./CodeSnippet-Cfe8KNVU.js";import"./Box-kUekMc6O.js";import"./styled-CICePBTu.js";import"./CopyTextButton-amdB5IIQ.js";import"./useCopyToClipboard-DtkwdRTx.js";import"./Tooltip-CpvnZrMV.js";import"./Popper-DI0r4x2S.js";import"./List-vAsLcuDY.js";import"./ListContext-Dr49CUeJ.js";import"./ListItem-F3f87gTr.js";import"./ListItemText-CcMD6A8n.js";import"./LinkButton-BzTRIntM.js";import"./Link--XlSoX1z.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-XX7OP1Eg.js";import"./Divider-Bq5dRhO-.js";import"./CardActions-DoU6wCz4.js";import"./BottomLink-4AtDZufv.js";import"./ArrowForward-CvuqPmlL.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
