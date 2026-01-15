import{j as t,m as u,I as p,b as g,T as h}from"./iframe-C9MahRWh.js";import{r as x}from"./plugin-wSPBrfkM.js";import{S as l,u as c,a as S}from"./useSearchModal-BYKGYUb_.js";import{B as m}from"./Button-Dzp_nJek.js";import{a as M,b as C,c as f}from"./DialogTitle-XE_ReIcx.js";import{B as j}from"./Box-CYNkyMDT.js";import{S as n}from"./Grid-Bq14PCTk.js";import{S as y}from"./SearchType-C7FC2cHR.js";import{L as I}from"./List-Bf1QAwLS.js";import{H as B}from"./DefaultResultListItem-BrxwcGzQ.js";import{s as D,M as G}from"./api-Dv1FYIKi.js";import{S as R}from"./SearchContext-U7wA8Cik.js";import{w as T}from"./appWrappers-CVRFJ8fS.js";import{SearchBar as k}from"./SearchBar-lAm4aSQ1.js";import{a as v}from"./SearchResult-00DeeV-h.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CjPvPLb3.js";import"./Plugin-COyD8Ape.js";import"./componentData-BjbrQk5D.js";import"./useAnalytics-BziQWZJs.js";import"./useApp-jr5Pcjzr.js";import"./useRouteRef-C79sp_qC.js";import"./index-Y3I5MZ_O.js";import"./ArrowForward-DNeec2hd.js";import"./translation-CMfwqRef.js";import"./Page-BGZZkbAn.js";import"./useMediaQuery-gX5c5zH6.js";import"./Divider-BPY2Btf9.js";import"./ArrowBackIos-Bm10eRSW.js";import"./ArrowForwardIos-C6RII4kr.js";import"./translation-B4D8L9y4.js";import"./Modal-C6HnS9UY.js";import"./Portal-CaSAJtdX.js";import"./Backdrop-B07gdzN9.js";import"./styled-DiHiiZIS.js";import"./ExpandMore-C29ppj5F.js";import"./useAsync-BWwk_eba.js";import"./useMountedState-Dn_kttD3.js";import"./AccordionDetails-DeCV1Glt.js";import"./index-B9sM2jn7.js";import"./Collapse-COZrbk8h.js";import"./ListItem-CEqAAvo8.js";import"./ListContext-C4u9JBBU.js";import"./ListItemIcon-C2o04ExQ.js";import"./ListItemText-ULNmgNfA.js";import"./Tabs-CubaPgKn.js";import"./KeyboardArrowRight-COZJwZta.js";import"./FormLabel-a44giEza.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DNC6bluv.js";import"./InputLabel-BrkX1vkj.js";import"./Select-CUd0a1W1.js";import"./Popover-CAIBXgWq.js";import"./MenuItem-Dv2xrnoS.js";import"./Checkbox-BD7KCmoE.js";import"./SwitchBase-g-Oud5Bi.js";import"./Chip-C1W0WT38.js";import"./Link-hmIS8MxR.js";import"./lodash-DLuUt6m8.js";import"./useObservable-s32LqZTU.js";import"./useIsomorphicLayoutEffect-DEny9FEg.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-3kd1RG9m.js";import"./useDebounce-Dsb9V7Ov.js";import"./InputAdornment-D6FZJS5r.js";import"./TextField-BKJ8Bm5J.js";import"./useElementFilter-BkKLtY7e.js";import"./EmptyState-BgCnSFPi.js";import"./Progress-DlrTiw-B.js";import"./LinearProgress-Yzi8SXqF.js";import"./ResponseErrorPanel-CtiSdvLc.js";import"./ErrorPanel-Cd_NhFA3.js";import"./WarningPanel-NX0KfHXh.js";import"./MarkdownContent-D9IOtBE8.js";import"./CodeSnippet-n_l-Y6Rc.js";import"./CopyTextButton-6HBTp066.js";import"./useCopyToClipboard-CMkmug0-.js";import"./Tooltip-BxZhHFnO.js";import"./Popper-BxhcTIEV.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
