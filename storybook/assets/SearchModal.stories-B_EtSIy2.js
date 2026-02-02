import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-DG9KPDCv.js";import{r as x}from"./plugin-CX4Te1i3.js";import{S as l,u as c,a as S}from"./useSearchModal-su0RRv7D.js";import{s as M,M as C}from"./api-CXYhJN8Z.js";import{S as f}from"./SearchContext-BllXntxY.js";import{B as m}from"./Button-B0fitv1X.js";import{D as j,a as y,b as B}from"./DialogTitle-DOFx0Hy9.js";import{B as D}from"./Box-CpNeY0Xu.js";import{S as n}from"./Grid-BalTlFvh.js";import{S as I}from"./SearchType-HwK17npI.js";import{L as G}from"./List-DESWnqW5.js";import{H as R}from"./DefaultResultListItem-Bk5E4KR4.js";import{w as k}from"./appWrappers-kZwlpPuG.js";import{SearchBar as v}from"./SearchBar-DnLO1qb7.js";import{S as T}from"./SearchResult-uG00Vuah.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C2A6q0Re.js";import"./Plugin-CiKdo3lK.js";import"./componentData-VtzvnnGf.js";import"./useAnalytics-DskDDOhn.js";import"./useApp-ijvxHEa-.js";import"./useRouteRef-CjX1VRTP.js";import"./index-Bi0fcTw3.js";import"./ArrowForward-CggHymR0.js";import"./translation-NQ035EfW.js";import"./Page-j75FCGrN.js";import"./useMediaQuery-CPLarBt1.js";import"./Divider-e6kSnJJ8.js";import"./ArrowBackIos-CQ1ekf8E.js";import"./ArrowForwardIos-BPD6IuNz.js";import"./translation-BHOLp7wz.js";import"./lodash-Czox7iJy.js";import"./useAsync-BV2n2o7b.js";import"./useMountedState-B6hIrLCn.js";import"./Modal-BgaFEzC9.js";import"./Portal-Du_aJAA6.js";import"./Backdrop-BPZGx_ZF.js";import"./styled-B_dsPLrg.js";import"./ExpandMore-CqQxAXKH.js";import"./AccordionDetails-BMa1mXpE.js";import"./index-B9sM2jn7.js";import"./Collapse-B-7etz-P.js";import"./ListItem-CdFlW9lK.js";import"./ListContext-Cqq2xDze.js";import"./ListItemIcon-BpSknpTV.js";import"./ListItemText-W0WQZlCP.js";import"./Tabs-DsYo7W32.js";import"./KeyboardArrowRight-D-n6FVla.js";import"./FormLabel-BfvEdZgn.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DPdVetVH.js";import"./InputLabel-BFY5u4Ls.js";import"./Select-145LJqm_.js";import"./Popover-Ce3qAytM.js";import"./MenuItem-CV9ILrOZ.js";import"./Checkbox-DOmgALbM.js";import"./SwitchBase-DLt2di76.js";import"./Chip-BCXeSDIr.js";import"./Link-BeOk29Gb.js";import"./useObservable-Bi2yOTki.js";import"./useIsomorphicLayoutEffect-C3SuLUwq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BAPuI8nd.js";import"./useDebounce-DqLoC7sf.js";import"./InputAdornment-TiA3q4Yx.js";import"./TextField-DOSLxdnG.js";import"./useElementFilter-CO4JoGzT.js";import"./EmptyState-Bxgp2PZ5.js";import"./Progress-RtqJKYao.js";import"./LinearProgress-DIbVHKOI.js";import"./ResponseErrorPanel-AFVrCZRC.js";import"./ErrorPanel-CIVa9hyi.js";import"./WarningPanel-Ttu6_E0y.js";import"./MarkdownContent-CFcdNsXY.js";import"./CodeSnippet-Bw31BDNG.js";import"./CopyTextButton-CBgD5fD0.js";import"./useCopyToClipboard-_Xorwdaf.js";import"./Tooltip-DkJtZmcZ.js";import"./Popper-BuiKgC9z.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
