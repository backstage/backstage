import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-omS-VfEE.js";import{s as g,H as u}from"./plugin-_6NABpqd.js";import{c as h}from"./api-CfgbfKHQ.js";import{c as f}from"./catalogApiMock-CeKsI1ay.js";import{s as x}from"./api-BPHn8KSC.js";import{S as y}from"./SearchContext-BqCLLorT.js";import{P as S}from"./Page-D1RZz1Lw.js";import{S as r}from"./Grid-BYUcu-HN.js";import{b as k,a as j,c as C}from"./plugin-COsCyJhl.js";import{T as P}from"./TemplateBackstageLogo-DgIXJPlo.js";import{T}from"./TemplateBackstageLogoIcon-CkoQsdwC.js";import{e as I}from"./routes-CRW5F21M.js";import{w as v}from"./appWrappers-D_rcKu23.js";import{s as G}from"./StarredEntitiesApi-CfYtzmG6.js";import{M as A}from"./MockStarredEntitiesApi-Diryaini.js";import{I as B}from"./InfoCard-k7q1vcR-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CxYQenE5.js";import"./Plugin-CgzkpFyB.js";import"./componentData-rUfARfxE.js";import"./useAnalytics-DpXUy368.js";import"./useApp-DFGFX2A_.js";import"./useRouteRef-Q1h4R6gV.js";import"./index-BJYML3pb.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./useAsync-XDPyEQBh.js";import"./useMountedState-B72_4ZkH.js";import"./DialogTitle-CbcbXP0z.js";import"./Modal-BJT6EnpA.js";import"./Portal-tl-MtD9Q.js";import"./Backdrop-peojPdzD.js";import"./Button-cwljLBUl.js";import"./useObservable-CWiuwahj.js";import"./useIsomorphicLayoutEffect-NeOa0wWc.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-mylIdFzd.js";import"./ErrorBoundary-bGwTKSED.js";import"./ErrorPanel-NSHOjdDK.js";import"./WarningPanel-BpYFzcLR.js";import"./ExpandMore-B7pPANEl.js";import"./AccordionDetails-BhNEpOi0.js";import"./index-B9sM2jn7.js";import"./Collapse-BMfiGGQz.js";import"./MarkdownContent-CrQrCbdZ.js";import"./CodeSnippet-D7viEsWF.js";import"./Box-CkfuSc_q.js";import"./styled-D7Xcwibq.js";import"./CopyTextButton-Dpc4LkrT.js";import"./useCopyToClipboard-fqzv143-.js";import"./Tooltip-ER_nPOs0.js";import"./Popper-DnFnSudK.js";import"./List-C9vsaZyo.js";import"./ListContext-CkIdZQYa.js";import"./ListItem-CyW2KymL.js";import"./ListItemText-pfsweG72.js";import"./LinkButton-D_wGBfsj.js";import"./Link-BWOCx2Nz.js";import"./CardHeader-Bsb9krxm.js";import"./Divider-B1hRM44o.js";import"./CardActions-BmZcl3bV.js";import"./BottomLink-BEo5oPXt.js";import"./ArrowForward-Q3VMHoWX.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
