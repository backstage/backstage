import{j as o}from"./iframe-omS-VfEE.js";import{c as e}from"./plugin-COsCyJhl.js";import{S as l}from"./Grid-BYUcu-HN.js";import{C as m}from"./ComponentAccordion-DIlAaUkA.js";import{w as a}from"./appWrappers-D_rcKu23.js";import{T as i}from"./TemplateBackstageLogoIcon-CkoQsdwC.js";import{I as s}from"./InfoCard-k7q1vcR-.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CgzkpFyB.js";import"./componentData-rUfARfxE.js";import"./useAnalytics-DpXUy368.js";import"./useApp-DFGFX2A_.js";import"./useRouteRef-Q1h4R6gV.js";import"./index-BJYML3pb.js";import"./DialogTitle-CbcbXP0z.js";import"./Modal-BJT6EnpA.js";import"./Portal-tl-MtD9Q.js";import"./Backdrop-peojPdzD.js";import"./Button-cwljLBUl.js";import"./useObservable-CWiuwahj.js";import"./useIsomorphicLayoutEffect-NeOa0wWc.js";import"./ExpandMore-B7pPANEl.js";import"./AccordionDetails-BhNEpOi0.js";import"./index-B9sM2jn7.js";import"./Collapse-BMfiGGQz.js";import"./useAsync-XDPyEQBh.js";import"./useMountedState-B72_4ZkH.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-mylIdFzd.js";import"./ErrorBoundary-bGwTKSED.js";import"./ErrorPanel-NSHOjdDK.js";import"./WarningPanel-BpYFzcLR.js";import"./MarkdownContent-CrQrCbdZ.js";import"./CodeSnippet-D7viEsWF.js";import"./Box-CkfuSc_q.js";import"./styled-D7Xcwibq.js";import"./CopyTextButton-Dpc4LkrT.js";import"./useCopyToClipboard-fqzv143-.js";import"./Tooltip-ER_nPOs0.js";import"./Popper-DnFnSudK.js";import"./List-C9vsaZyo.js";import"./ListContext-CkIdZQYa.js";import"./ListItem-CyW2KymL.js";import"./ListItemText-pfsweG72.js";import"./LinkButton-D_wGBfsj.js";import"./Link-BWOCx2Nz.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-Bsb9krxm.js";import"./Divider-B1hRM44o.js";import"./CardActions-BmZcl3bV.js";import"./BottomLink-BEo5oPXt.js";import"./ArrowForward-Q3VMHoWX.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
