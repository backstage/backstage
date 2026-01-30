import{j as o}from"./iframe-DbI6eD9d.js";import{c as e}from"./plugin-Cq85gQWd.js";import{S as l}from"./Grid-Bk30WVxK.js";import{C as m}from"./ComponentAccordion-DaUSBEen.js";import{w as a}from"./appWrappers-ysziI5ZA.js";import{T as i}from"./TemplateBackstageLogoIcon-kmgtuZMF.js";import{I as s}from"./InfoCard-C7uWqAKI.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Bb9hU_OU.js";import"./componentData-BY8qZ-sE.js";import"./useAnalytics-DxBTGODq.js";import"./useApp-By-GP-XF.js";import"./useRouteRef-DM8Co2Wr.js";import"./index-BpirQtKL.js";import"./DialogTitle-Bnldogbn.js";import"./Modal-DSfyr1-Y.js";import"./Portal-1epzlOBv.js";import"./Backdrop-lRnFqTe6.js";import"./Button-BcRwA9XB.js";import"./useObservable-BAzjAwDp.js";import"./useIsomorphicLayoutEffect-BUXckimh.js";import"./ExpandMore-CGV1QMso.js";import"./AccordionDetails-BibEu-2M.js";import"./index-B9sM2jn7.js";import"./Collapse-DuLdQbrv.js";import"./useAsync-CgxXauOf.js";import"./useMountedState-x9skCR0V.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CaMsCQ3C.js";import"./ErrorBoundary-Pnzm6LGL.js";import"./ErrorPanel-DlUDd-32.js";import"./WarningPanel-M9-9T0mj.js";import"./MarkdownContent-BnX0THa8.js";import"./CodeSnippet-Cbn7wM4l.js";import"./Box-B_5N4RtH.js";import"./styled-Ca3T9n7C.js";import"./CopyTextButton-B5-s-8U_.js";import"./useCopyToClipboard-DYI1pKNQ.js";import"./Tooltip-Bq7wKed5.js";import"./Popper-9ImL6E1W.js";import"./List-B28Z8F3S.js";import"./ListContext-D83WNTGA.js";import"./ListItem-BiTyGeEf.js";import"./ListItemText-Cbx6sNjJ.js";import"./LinkButton-T-0yH8W0.js";import"./Link-BjQEuYrU.js";import"./lodash-Czox7iJy.js";import"./CardHeader-DaQVS7Av.js";import"./Divider-CO6unGqT.js";import"./CardActions-B6MuYnHZ.js";import"./BottomLink-hMDyPyJY.js";import"./ArrowForward-0RbzQf1a.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
