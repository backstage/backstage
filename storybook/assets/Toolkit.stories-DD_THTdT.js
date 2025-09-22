import{j as o}from"./iframe-hvh2aMf9.js";import{c as e}from"./plugin-DBTSfPRA.js";import{S as l}from"./Grid-DbJ44Ewx.js";import{C as m}from"./ComponentAccordion-CtJVlr3_.js";import{w as a}from"./appWrappers-Br-zmgYb.js";import{T as i}from"./TemplateBackstageLogoIcon-C-XiN_xM.js";import{I as s}from"./InfoCard-C848hzjp.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BVqzn08d.js";import"./componentData-DJ30wAD0.js";import"./useAnalytics-CVphDHTH.js";import"./useApp-CqXr_4Cz.js";import"./useRouteRef-CAeo51pw.js";import"./index-7QU1_rFp.js";import"./DialogTitle-GCc4cGcE.js";import"./Modal-D7enm8Ov.js";import"./Portal-Bb9zcDOK.js";import"./Backdrop-B_m0crbj.js";import"./Button-DCfJTuUb.js";import"./useObservable-BBWREk27.js";import"./useIsomorphicLayoutEffect-BrJ5WAHL.js";import"./ExpandMore-nelLsYHb.js";import"./AccordionDetails-DLZ6dsCT.js";import"./index-DnL3XN75.js";import"./Collapse-PeWKU6hc.js";import"./useAsync-DTXafnw5.js";import"./useMountedState-CuwT9qKs.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-DN23BuSy.js";import"./ErrorBoundary-Dh8qKDOl.js";import"./ErrorPanel-DykIF4Ux.js";import"./WarningPanel-CJ_nUs4N.js";import"./MarkdownContent-DCK-3Ric.js";import"./CodeSnippet-5nQo7gNl.js";import"./Box-BjIjXY28.js";import"./styled-CsVOCgfV.js";import"./CopyTextButton-FOvJ_Vam.js";import"./useCopyToClipboard-D9VM6fel.js";import"./Tooltip-Y5wSFqY4.js";import"./Popper-CHxzJWK6.js";import"./List-74W1l74F.js";import"./ListContext-DMJfGJuk.js";import"./ListItem-CXtueEiL.js";import"./ListItemText-Cnvrb4zg.js";import"./LinkButton-CbQ3iKUC.js";import"./Link-CHVET8I2.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CuySZ8Hj.js";import"./Divider-D1DdZhOv.js";import"./CardActions-DuulD9pz.js";import"./BottomLink-Svs5ms_-.js";import"./ArrowForward-DlduA0Ms.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
