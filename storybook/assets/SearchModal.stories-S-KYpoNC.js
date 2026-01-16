import{j as t,m as u,I as p,b as g,T as h}from"./iframe-Ck0aXmTM.js";import{r as x}from"./plugin-CAuMYVMv.js";import{S as l,u as c,a as S}from"./useSearchModal-BTvaZuVj.js";import{B as m}from"./Button-1pGVjime.js";import{a as M,b as C,c as f}from"./DialogTitle-CrkBwyZG.js";import{B as j}from"./Box-DpOIFL5c.js";import{S as n}from"./Grid-DJzZ2-y-.js";import{S as y}from"./SearchType-ssDWx6LP.js";import{L as I}from"./List-Ch4xqBdJ.js";import{H as B}from"./DefaultResultListItem-Rx6lv_iK.js";import{s as D,M as G}from"./api-C8f7c2KJ.js";import{S as R}from"./SearchContext-CAoTKpVL.js";import{w as T}from"./appWrappers-sOes-H4-.js";import{SearchBar as k}from"./SearchBar-BqRLlkKw.js";import{a as v}from"./SearchResult-CdNpfdgV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D6wcFf9r.js";import"./Plugin-D0ldxJ2a.js";import"./componentData-CCV_iCSl.js";import"./useAnalytics-B-_BiaZI.js";import"./useApp-Bsc5dzDy.js";import"./useRouteRef-CUlQEYbr.js";import"./index-DzaKdVpu.js";import"./ArrowForward-DkJkdPgV.js";import"./translation-leLtmUuh.js";import"./Page-DhJ6ilWB.js";import"./useMediaQuery-D88h0Om1.js";import"./Divider-B0knNu2M.js";import"./ArrowBackIos-Dj99BrYh.js";import"./ArrowForwardIos-DgbzuUZC.js";import"./translation-C4DEX1p_.js";import"./Modal-CynqYC-h.js";import"./Portal-enzQuAv4.js";import"./Backdrop-D-sGQwlB.js";import"./styled-DLjnXpzN.js";import"./ExpandMore-XskE5SkY.js";import"./useAsync-p0jLc8GG.js";import"./useMountedState-BgEDmEmL.js";import"./AccordionDetails-Dunbukgx.js";import"./index-B9sM2jn7.js";import"./Collapse-DxAw5EoH.js";import"./ListItem-BI_yLDsO.js";import"./ListContext-m5pyxhJx.js";import"./ListItemIcon-DwE0qrkP.js";import"./ListItemText-BN5MiG2A.js";import"./Tabs-KFZNNlhe.js";import"./KeyboardArrowRight-C9n1rqXm.js";import"./FormLabel-CkkwWIYx.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BzjRiLCP.js";import"./InputLabel-BsJlp0uy.js";import"./Select-CjOIaqH8.js";import"./Popover-C9BG-sVO.js";import"./MenuItem-DRhwvxmp.js";import"./Checkbox-xWzz3qf8.js";import"./SwitchBase-BAdEGN-J.js";import"./Chip-8YtE52gZ.js";import"./Link-8mv2gKfv.js";import"./lodash-DLuUt6m8.js";import"./useObservable-DUKTvAPs.js";import"./useIsomorphicLayoutEffect-CpSeSuYs.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BtINX92L.js";import"./useDebounce-9dQqnJiA.js";import"./InputAdornment-BGZ9ZSNs.js";import"./TextField-D64ZNtUr.js";import"./useElementFilter-CwOSdpfj.js";import"./EmptyState-CAHB2tbS.js";import"./Progress-DdwM_AUv.js";import"./LinearProgress-DBvqEqE7.js";import"./ResponseErrorPanel-CORIeFI6.js";import"./ErrorPanel-SFTFZur6.js";import"./WarningPanel-BnKvh7bd.js";import"./MarkdownContent-DTz2Je40.js";import"./CodeSnippet-1zCVoflW.js";import"./CopyTextButton-C18-3nwc.js";import"./useCopyToClipboard-g3w1_GHx.js";import"./Tooltip-Sxlj4qdH.js";import"./Popper-DOPOD1lh.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
