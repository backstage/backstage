import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-DKl1TaBY.js";import{s as g,H as u}from"./plugin-CNz7lisr.js";import{c as h}from"./api-DQyl4QJ5.js";import{c as f}from"./catalogApiMock-KGAmxi57.js";import{s as x}from"./api-CzWMH9sB.js";import{S as y}from"./SearchContext-Dh6i_bMc.js";import{P as S}from"./Page-CcXpkCNI.js";import{S as r}from"./Grid-DucnE1Qv.js";import{b as k,a as j,c as C}from"./plugin-ofVW4ekV.js";import{T as P}from"./TemplateBackstageLogo-BC1U8Evc.js";import{T}from"./TemplateBackstageLogoIcon-D-WLwKOR.js";import{e as I}from"./routes-CXk1nUCX.js";import{w as v}from"./appWrappers-CQMFW9f8.js";import{s as G}from"./StarredEntitiesApi-BLZY5Rt8.js";import{M as A}from"./MockStarredEntitiesApi-Thp0zSW6.js";import{I as B}from"./InfoCard-BXfocUJP.js";import"./preload-helper-D9Z9MdNV.js";import"./index-D3KAHFPL.js";import"./Plugin-Cp-tNdu1.js";import"./componentData-C9VKpHEQ.js";import"./useAnalytics-CECp0-UO.js";import"./useApp-OM9z5S5N.js";import"./useRouteRef-CjGG19qw.js";import"./index-CAizWZSO.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-6VrnLR2E.js";import"./useMountedState-Bg5ZLpHR.js";import"./DialogTitle-BfB3GFxp.js";import"./Modal-Dg-OYacR.js";import"./Portal-t3ECfreD.js";import"./Backdrop-C6FYe0Ep.js";import"./Button-ho9zTU_x.js";import"./useObservable-DEWsWzFy.js";import"./useIsomorphicLayoutEffect-5ZyPzn4u.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BnHsAJ1f.js";import"./ErrorBoundary-pwMpy8Pl.js";import"./ErrorPanel-9AkQroOm.js";import"./WarningPanel-eVG4_neK.js";import"./ExpandMore-SNT8Gr9W.js";import"./AccordionDetails-5IM8yJG8.js";import"./index-DnL3XN75.js";import"./Collapse-DRCUh2Je.js";import"./MarkdownContent-Cd_tUbb9.js";import"./CodeSnippet-CNnnJvIp.js";import"./Box-8sIy39Mn.js";import"./styled-DuPROqdG.js";import"./CopyTextButton-TfPCFLIm.js";import"./useCopyToClipboard-BgwPpn9s.js";import"./Tooltip-73fNlhkg.js";import"./Popper-BCEz05NO.js";import"./List-BKhl6P7T.js";import"./ListContext-Df16DwNz.js";import"./ListItem-Cik-ImzB.js";import"./ListItemText-X8gsxozg.js";import"./LinkButton-Bm5eURQl.js";import"./Link-BtYWFjac.js";import"./CardHeader-CZMAOeHX.js";import"./Divider-DdBr9tFd.js";import"./CardActions-BFLytzP8.js";import"./BottomLink-BpjWpCp6.js";import"./ArrowForward-DvHRQMuG.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
