import{j as o}from"./iframe-C9zrakkc.js";import{c as e}from"./plugin-FvNGz4xC.js";import{S as l}from"./Grid-JwSod7uj.js";import{C as m}from"./ComponentAccordion-Clzn9_vP.js";import{w as a}from"./appWrappers-D30AEFfJ.js";import{T as i}from"./TemplateBackstageLogoIcon-Ch0wtquG.js";import{I as s}from"./InfoCard-RbAMJy0N.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-DYqBkcEW.js";import"./componentData-CTZUzyGA.js";import"./useAnalytics-DAZilNqi.js";import"./useApp-5u7uhQnf.js";import"./useRouteRef-u0DWcSPD.js";import"./index-kZEKiPjo.js";import"./DialogTitle-Bu0pvr4n.js";import"./Modal-BI7VDIZ7.js";import"./Portal-CYobuNZx.js";import"./Backdrop-CAN_1fph.js";import"./Button-CmMZjW_f.js";import"./useObservable-DNrCFxZS.js";import"./useIsomorphicLayoutEffect-BN5wUfcv.js";import"./ExpandMore-BmhSC8QK.js";import"./AccordionDetails-CO835Xyy.js";import"./index-B9sM2jn7.js";import"./Collapse-BSaPuFEG.js";import"./useAsync-ClKr9TyR.js";import"./useMountedState-C5AiKHab.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-o9HZeIUg.js";import"./ErrorBoundary-DT6g9ILI.js";import"./ErrorPanel-C1y9p2wT.js";import"./WarningPanel-BpsyaNdk.js";import"./MarkdownContent-DnFMmDme.js";import"./CodeSnippet-DR38SpuH.js";import"./Box-C1t3nISm.js";import"./styled-q2Tapbp0.js";import"./CopyTextButton-ClvHCzDa.js";import"./useCopyToClipboard-hqcagNht.js";import"./Tooltip-CwwM6KlC.js";import"./Popper-CnoPmosF.js";import"./List-Dykhft8E.js";import"./ListContext-D4YzdYeM.js";import"./ListItem-DN7mBFNT.js";import"./ListItemText-u9zyj5b2.js";import"./LinkButton-C-LjwduR.js";import"./Link-C1eBfv8e.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-BJEjS_-7.js";import"./Divider-BvnOZNSI.js";import"./CardActions-C42Lpz0g.js";import"./BottomLink-CXlh_zpn.js";import"./ArrowForward-B_STm-OI.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
