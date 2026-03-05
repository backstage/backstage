import{j as t,W as u,K as p,X as g}from"./iframe-CdLF-10Q.js";import{r as h}from"./plugin-BlGii4c0.js";import{S as l,u as c,a as x}from"./useSearchModal-DwEdFaFh.js";import{s as S,M}from"./api-CUS7QsOy.js";import{S as C}from"./SearchContext-BcHLcYfH.js";import{B as m}from"./Button-073X8JpY.js";import{m as f}from"./makeStyles-DHrBvqm9.js";import{D as j,a as y,b as B}from"./DialogTitle-C-nZZCG6.js";import{B as D}from"./Box-BEpYmdO6.js";import{S as n}from"./Grid-CH2eTvwA.js";import{S as I}from"./SearchType-BixxTVjP.js";import{L as G}from"./List-C4Q5M6UV.js";import{H as R}from"./DefaultResultListItem-B8H8FUqq.js";import{w as k}from"./appWrappers-DASZKQIr.js";import{SearchBar as v}from"./SearchBar-B3sProNt.js";import{S as T}from"./SearchResult-dgD_uWAQ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CZ23ng2i.js";import"./Plugin-HmP2DfTO.js";import"./componentData-8t3axC0x.js";import"./useAnalytics-uwBj52oz.js";import"./useApp-B_Lst6SJ.js";import"./useRouteRef-8L_KzPqc.js";import"./index-llat7fUI.js";import"./ArrowForward-BJQnNOX7.js";import"./translation-B1fcPHPK.js";import"./Page-DNEmlYTo.js";import"./useMediaQuery-HSNyejSw.js";import"./Divider-CcgYYsI7.js";import"./ArrowBackIos-CpZikhgk.js";import"./ArrowForwardIos-C1pw8ajw.js";import"./translation-l9yFT5vb.js";import"./lodash-BVTqar6L.js";import"./useAsync-DVe3O40E.js";import"./useMountedState-BDx40LHi.js";import"./Modal-BHOZm2fX.js";import"./Portal-6YsMjpwZ.js";import"./Backdrop-1cbn2Sg8.js";import"./styled-DKVD7tgY.js";import"./ExpandMore-DVqt5hF5.js";import"./AccordionDetails-CZjHoqUV.js";import"./index-B9sM2jn7.js";import"./Collapse-B1-4SWZd.js";import"./ListItem-Ca20zprb.js";import"./ListContext-DDpewh2C.js";import"./ListItemIcon-D7-qAw72.js";import"./ListItemText-4_UOFiGy.js";import"./Tabs-DFcaHsWB.js";import"./KeyboardArrowRight-BJV4UFnm.js";import"./FormLabel-B1uhunF4.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-QM9B49fu.js";import"./InputLabel-DHShei8Z.js";import"./Select-DGldOmAq.js";import"./Popover-BqH4VyXe.js";import"./MenuItem-Cqa5e8KQ.js";import"./Checkbox-Bl2Ki0Zv.js";import"./SwitchBase-Di-WEGwR.js";import"./Chip-CE1WeEep.js";import"./Link-ChiTmoa9.js";import"./index-BdTZ39qe.js";import"./useObservable-OZCyaoCC.js";import"./useIsomorphicLayoutEffect-cy8e_yxE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BAvyEPn2.js";import"./useDebounce-BFVyH-T2.js";import"./InputAdornment-D6CTIqlZ.js";import"./TextField-Bn1oYGgu.js";import"./useElementFilter-Z2UdWFBB.js";import"./EmptyState-CuUn2XyB.js";import"./Progress-B24nFqeF.js";import"./LinearProgress-yZFzP7iX.js";import"./ResponseErrorPanel-DO6VeTxV.js";import"./ErrorPanel-DUV9SSfF.js";import"./WarningPanel-BmDQ6rpx.js";import"./MarkdownContent-6f6BdLYh.js";import"./CodeSnippet-DwKCsuin.js";import"./CopyTextButton-5GxBmYDa.js";import"./useCopyToClipboard-BIKQgYSu.js";import"./Tooltip-r72wdggD.js";import"./Popper-g8OlZzUX.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
