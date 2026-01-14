import{j as o}from"./iframe-OUC1hy1H.js";import{c as e}from"./plugin-Ba_XObH0.js";import{S as l}from"./Grid-DL-Pv4jh.js";import{C as m}from"./ComponentAccordion-7ig0_QOA.js";import{w as a}from"./appWrappers-DdOwToTM.js";import{T as i}from"./TemplateBackstageLogoIcon-CAtnkGnb.js";import{I as s}from"./InfoCard-CwMIYekH.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-DZn2Fxqk.js";import"./componentData-vJLnAM-9.js";import"./useAnalytics-XQGKPciY.js";import"./useApp-DyctZIWE.js";import"./useRouteRef-CAXRaq-D.js";import"./index-_R9_qqkB.js";import"./DialogTitle-CzK5jlaa.js";import"./Modal-B-jUxT4P.js";import"./Portal-DWQSZWuh.js";import"./Backdrop-D5NJdiNK.js";import"./Button-NJYqsc8m.js";import"./useObservable-BKXVW6Yy.js";import"./useIsomorphicLayoutEffect-BzuPE6E0.js";import"./ExpandMore-YNQPypsM.js";import"./AccordionDetails-BV-iIFxu.js";import"./index-B9sM2jn7.js";import"./Collapse-WWepLYBs.js";import"./useAsync-4gF4WzZl.js";import"./useMountedState-BrWxqueh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Cy9Tlq5V.js";import"./ErrorBoundary-ajCvZdhL.js";import"./ErrorPanel-D45LPvzG.js";import"./WarningPanel-4XJbGV6W.js";import"./MarkdownContent-DHn9pYVo.js";import"./CodeSnippet-DchPM48d.js";import"./Box-BmoTrTFH.js";import"./styled-A6cHt6de.js";import"./CopyTextButton-DRNDJ6Lk.js";import"./useCopyToClipboard-B_WaDLJZ.js";import"./Tooltip-BQGIC7Cn.js";import"./Popper-vVGWEO2q.js";import"./List--3INAzqF.js";import"./ListContext-DyoBs2U6.js";import"./ListItem-CyBq-NVx.js";import"./ListItemText-BN19jovg.js";import"./LinkButton-KIWM0vJK.js";import"./Link-CyOWt6Zg.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-GsaXemtv.js";import"./Divider-CEY86Jg2.js";import"./CardActions-ZHQriakr.js";import"./BottomLink-uShqIaMy.js";import"./ArrowForward-CNrami9f.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
